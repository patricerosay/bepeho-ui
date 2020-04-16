import { Injectable } from '@angular/core';
import { ScriptService } from '../scripts/script.service';

declare var document: any;

@Injectable()
export class WebRTCService {
    public cloudUrl = 'https://cloud.apizee.com';
    currentLocalStream: any;
    public connectedConversation: any;
    connectedSession: any;
    isConnected: boolean;
    public isLive: boolean;
    ua: any;
    selectedvideo: unknown;
    selectedaudio: unknown;
    selectedaudiooutput: unknown;
    public audioMuted: any;
    public videoMuted: any;
    public joining: boolean;
    public recordingInterview: any;
    public screensharingStream: any;
    apiRTC: any;
    errorMsg: any;
    isLoading: boolean;
    remoteContact: any;
    private scriptService: ScriptService;
    currentStreamID: any;
    // public webcams = new Map<String, any>();
    public webcams = [];

    constructor() {
    }

    load(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            this.scriptService = new ScriptService();
            this.scriptService.load('apizee').then(data => {
                self.apiRTC = window['apiRTC'];

                self.apiRTC.setLogLevel(0);

                const apikey = localStorage.getItem('apikey');
                this.ua = new this.apiRTC.UserAgent({
                    uri: apikey,
                });
                // self.initWebCams();

                self.isLoading = false;
                return resolve();

            }).catch(error => {
                self.errorMsg = error;
                reject();
            });
        });
    }
    hangup(): void {
        if (this.currentLocalStream) {
            this.currentLocalStream.release();
            this.currentLocalStream = null;
        }
        if (this.connectedConversation) {
            this.connectedConversation
                .leave()
                .then(function () {
                    console.log('conversation successfully left');
                })
                .catch(function (err) {
                    console.error('error whil leaving conversation', err);
                });
            this.connectedConversation = null;
        }
        if (this.connectedSession) {
            this.connectedSession.disconnect();
            this.connectedSession = null;
        }
        this.isLive = false;
        this.isConnected = false;

        if (this.ua) {
            this.ua
                .unregister({
                    cloudUrl: this.cloudUrl
                })
                .then(() => {
                    // OK : UserAgent is disconnected from the Apizee platform
                })
                .catch(error => {
                    // this.errorMsg = ' disconnection error ' + error;
                    console.error(error);
                });
        }
        this.webcams.forEach(element => {
            element.stream.release();
        });
        // this.contactCount = 'Disconnected';
    }
    releaseCallStream(stream): any {
        if (!this.connectedConversation) {
            return null;
        }
        if (!stream) {
            return null;
        }
        const call = this.connectedConversation.getConversationCall(stream);
        return call;
    }
    publishThisStream(streamId) {
        this.selectedvideo = streamId;
        if (!this.connectedConversation) {
            console.log('no conversation. Stream publication aborted', streamId);
            return;
        }
        const call = this.releaseCallStream(this.currentLocalStream);

        if (call) {
            // Switch the camera if call is ongoing

            for (let i = 0; i < this.webcams.length; i++) {
                if (this.webcams[i].id === streamId) {
                    const stream = this.webcams[streamId];
                    call.replacePublishedStream(streamId);
                    this.currentLocalStream = stream;
                    break;
                }
            }
        }
    }

    async displayWebCams(cam, elementId) {
        const self = this;
        const _id = 'webcam-' + cam.id;

        await self.webcams.forEach(v => {
            if (v.id === _id) {
                console.log('aborting the insert as this webcam is already there ', _id);
            }
        });

        const createStreamOptions = {
            audioInputId: false,
            videoInputId: cam.id,
            constraints: {
                video: {
                    frameRate: { min: 5, max: 25, ideal: 20 },
                    width: { min: '160', max: '1080', ideal: '640' },
                    height: { min: '120', max: '720', ideal: '480' }
                }
            }
        };
        this.ua.createStream(createStreamOptions)
            .then(function (_stream) {
                self.webcams.push({ id: _id, stream: _stream });

                self.currentLocalStream = _stream;

                // const container = document.getElementById(elementId);
                // // Create media element
                // const mediaElement = document.createElement('video');
                // mediaElement.id = 'remote-media-' + _stream.streamId;
                // mediaElement.autoplay = true;
                // mediaElement.muted = false;
                // // Add media element to media container
                // container.appendChild(mediaElement);
                // // Attach stream
                // _stream.attachToElement(mediaElement);

                // _stream.addInDiv('locals', 'local-media', { width: '90%', height: '90%' }, true);
            })
            .catch(function (err) {
                console.error('create stream error', err);
            });
    }
    assignWebcams(element) {

        const e = document.getElementById(element.id);

        this.webcams.forEach(v => {

            if (v.id === element.id) {

                console.log('assignment of', v);

                v.stream.attachToElement(e);
            }
        });


    }
    initWebCams() {
        const self = this;

        self.ua.on('mediaDeviceChanged', function (dev) {
            console.log('mediaDeviceChanged');
            const devices = self.ua.getUserMediaDevices();
            if (!devices) {
                console.log('No I/O User Media Devices');
            }
            if (Object.values(devices.videoinput).length) {
                // sevideoinputs ;

                for (let i = 0; i < Object.values(devices.videoinput).length; i++) {
                    const wc = Object.values(devices.videoinput)[i];
                    // self.videoinputs.push(wc);
                    self.displayWebCams(wc, 'webcams');
                    self.selectedvideo = wc;
                }
                // self.selectedvideo = self.videoinputs[0].id;
            }
            if (Object.values(devices.audioinput).length) {
                // self.audioinputs = [];
                for (let i = 0; i < Object.values(devices.audioinput).length; i++) {
                    // self.audioinputs.push(Object.values(devices.audioinput)[i]);
                    self.selectedaudio = Object.values(devices.audioinput)[i];
                }
                // self.selectedaudio = self.audioinputs[0].id;
            }

            if (Object.values(devices.audiooutput).length) {
                // self.audiooutputs = [];
                for (let i = 0; i < Object.values(devices.audiooutput).length; i++) {
                    // self.audiooutputs.push(Object.values(devices.audiooutput)[i]);
                    self.selectedaudiooutput = Object.values(devices.audiooutput)[i];
                }
                // self.selectedaudiooutput = self.audiooutputs[0].id;
            }
        });

    }

    createWebcamAudioVideoStreams() {
        const call = this.releaseCallStream(this.currentLocalStream);
        const callback = {
            getStream: () => {
                const self = this;
                return new Promise((resolve, reject) => {
                    const createStreamOptions = {
                        audioInputId: self.selectedaudio,
                        videoInputId: self.selectedvideo,
                        constraints: {
                            audio: true,
                            video: {
                                frameRate: { min: 5, max: 25, ideal: 20 },
                                width: { min: '160', max: '1080', ideal: '640' },
                                height: { min: '120', max: '720', ideal: '480' }
                            }
                        }
                    };

                    self.ua
                        .createStream(createStreamOptions)
                        .then(function (stream) {
                            // Save local stream
                            self.currentLocalStream = stream;

                            const elmt = document.getElementById('local-container-placeholder');
                            if (elmt) {
                                elmt.remove();
                            }
                            stream.removeFromDiv('local-container', 'local-media');
                            stream.addInDiv('local-container', 'local-media', { width: '90%', height: '90%' }, true);
                            return resolve(stream);
                        })
                        .catch(function (err) {
                            //   self.errorMsg = 'create stream error' + err;
                            //   console.error(self.errorMsg);

                            reject(err);
                        });
                });
            }
        };

        if (call) {
            // Switch the camera if call is ongoing
            return call.replacePublishedStream(null, callback);
        } else {
            return callback.getStream();
        }
    }
    onMutingVideo(mute) {
        this.videoMuted = mute;
        if (!this.currentLocalStream) {
            console.log('video muting aborted: no local stream');
            return;
        }

        if (mute) {
            console.log('muting video');
            this.currentLocalStream.muteVideo();
        } else {
            console.log('unmuting video');
            this.currentLocalStream.unmuteVideo();
        }
    }
    onMutingAudio(mute) {
        this.audioMuted = mute;
        if (!this.currentLocalStream) {
            console.log('audio muting aborted: no local stream');
            return;
        }

        if (mute) {
            console.log('muting audio');
            this.currentLocalStream.muteAudio();
        } else {
            console.log('unmuting audio');
            this.currentLocalStream.unmuteAudio();
        }
    }
    changeAudioInput($event) {
        this.selectedaudio = $event.value;
        if (this.connectedConversation) {
            this.createWebcamAudioVideoStreams();
        }
    }
    joinConference(conferenceName: string): void {

        const self = this;
        console.log('joining');
        self.joining = true;
        const registerInformation = {
            token: localStorage.getItem('token'),
            password: localStorage.getItem('apipass'),
            cloudFetchRetries: 3,
            cloudFetchRetryDelay: 2000
        };


        this.ua.register(registerInformation).then(function (session) {
            console.log('registered');
            self.ua.setOverallOutgoingVideoBandwidth(self.getLocalStorageNumber('upload-kbps', 100));
            self.ua.setOverallIncomingVideoBandwidth(self.getLocalStorageNumber('download-kbps', 100));

            self.connectedSession = session;
            self.isConnected = true;
            self.connectedSession
                .on('contactListUpdate', function (updatedContacts) {
                    // console.log('MAIN - contactListUpdate', updatedContacts);
                    if (self.connectedConversation) {
                        const contactList = self.connectedConversation.getContacts();
                        self.isLive = 0 < Object.values(self.connectedConversation.getContacts()).length;
                        // self.contactCount ='Connected users: ' + Object.values(self.contactList).length;
                    }
                });


            self.connectedConversation = self.connectedSession.getConversation(conferenceName);

            self.connectedConversation
                .on('streamListChanged', function (streamInfo) {
                    if (streamInfo.listEventType === 'added') {
                        if (streamInfo.isRemote === true) {
                            self.remoteContact = streamInfo.contact.userData.nickname;
                            self.connectedConversation.subscribeToMedia(streamInfo.streamId)
                                .then(function () {
                                    console.log('subscribeToMedia success');
                                }).catch(function (err) {
                                    console.log(err);
                                    self.errorMsg = err;
                                });
                        }
                    }
                });

            self.connectedConversation
                .on('streamAdded', function (stream) {
                    self.currentStreamID = stream;

                    stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, { width: '100%', height: '100%' }, false);
                    document.getElementById('remote-container-placeholder').setAttribute('class', 'minimized');

                }).on('streamRemoved', function (stream) {
                    stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
                    self.currentStreamID = null;
                });


            const createStreamOptions = {
                audioInputId: self.selectedaudio,
                videoInputId: self.selectedvideo,
                constraints: {
                    video: {
                        frameRate: { min: 5, max: 25, ideal: 20 },
                        width: { min: '160', max: '1080', ideal: '640' },
                        height: { min: '120', max: '720', ideal: '480' }
                    }
                }
            };

            self.connectedConversation.join()
                .then(function (response) {
                    self.isConnected = true;
                    self.joining = false;
                    console.log('joined');
                    self.connectedConversation.publish(self.currentLocalStream, createStreamOptions);
                });

        }).catch(function (err) {
            console.error(err);
            self.errorMsg = err;
            self.isConnected = false;
        });
        // });
    }
    recordInterview(recordingInterview) {
        console.log('record interview');
        const self = this;
        self.recordingInterview = recordingInterview;
        const option = {
            audioOnly: false,
            videoOnly: false,
            customIdInFilename: 'fromTheBoat',
            mode: 'complete'
        };
        if (self.recordingInterview) {
            this.connectedConversation.startRecording(option).then(function (info) {
                console.log(info);
            }).catch(function (err) {
                console.log(err);
                self.errorMsg = err;
            });
        } else {
            this.connectedConversation.stopRecording().then(function (info) {
                console.log(info);
            }).catch(function (err) {
                console.log(err);
                self.errorMsg = err;
            });
        }
        console.log(event);
    }

    shareScreen() {
        console.log('on sharescreen');
        const self = this;
        if (!self.screensharingStream) {
            let captureSourceType;
            if (self.apiRTC.browser === 'Firefox') {
                captureSourceType = 'screen';
            } else {
                // Chrome
                // captureSourceType = ["screen", "window", "tab", "audio"];
                captureSourceType = ['screen'];
            }

            self.apiRTC.Stream.createScreensharingStream(captureSourceType)
                .then(function (stream) {

                    stream.on('stopped', function () {
                        // Used to detect when user stop the screenSharing with Chrome DesktopCapture UI
                        console.log('stopped event on stream');
                        document.getElementById('local-screensharing').remove();
                        self.screensharingStream = null;
                    });

                    self.screensharingStream = stream;
                    self.connectedConversation.publish(self.screensharingStream);
                    // Get media container
                    const container = document.getElementById('local-container');

                    // Create media element
                    const mediaElement = document.createElement('video');
                    mediaElement.id = 'local-screensharing';
                    mediaElement.autoplay = true;
                    mediaElement.muted = true;

                    // Add media element to media container
                    container.appendChild(mediaElement);

                    // Attach stream
                    self.screensharingStream.attachToElement(mediaElement);

                })
                .catch(function (err) {
                    console.error('Could not create screensharing stream :', err);
                });
        } else {
            self.connectedConversation.unpublish(self.screensharingStream);
            self.screensharingStream.release();
            self.screensharingStream = null;
            document.getElementById('local-screensharing').remove();
        }

    }
    getCookieInfo(key: string): string {
        return localStorage.getItem(key);
    }
    getLocalStorageNumber(k: string, def: number): number {
        const v = localStorage.getItem(k);
        if (!v) { return def; }
        let n = Number(v);
        if (isNaN(n)) {
            n = def;
        }
        return n;
    }

}
