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
    public currentCall: any;
    ua: any;
    selectedvideo: any;
    selectedAudioInput: any;
    audioInputs: any[];
    audioOutputs: any[];
    selectedaudiooutput: any;
    public audioMuted: any;
    public videoMuted: any;
    public joiningVideoCall: boolean;
    public joiningCall: boolean;
    public recordingInterview: any;
    public screensharingStream: any;
    apiRTC: any;
    errorMsg: any;
    isLoading: boolean;
    remoteContact: any;
    private scriptService: ScriptService;
    currentRemoteStreamID: any;
    // public webcams = new Map<String, any>();
    public webcams = [];
    public isVP9=false;
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
        if (this.currentCall) {
            this.currentCall.hangUp();
            this.currentCall = null;
        }
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

        // this.contactCount = 'Disconnected';
    }
    releaseWebCams() {
        this.webcams.forEach(element => {
            element.stream.release();
        });
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


    async displayWebCams(cam, elementId) {
        const self = this;
        // const _id = 'webcam-' + cam.id;
        const _id = cam.id;
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

            })
            .catch(function (err) {
                console.error('create stream error', err, cam);
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
                self.webcams = [];
                for (let i = 0; i < Object.values(devices.videoinput).length; i++) {
                    const wc = Object.values(devices.videoinput)[i];
                    // self.videoinputs.push(wc);
                    self.displayWebCams(wc, 'webcams');
                    self.setSelectedVideo(wc);
                }
            }
            if (Object.values(devices.audioinput).length) {
                self.audioInputs = [];
                for (let i = 0; i < Object.values(devices.audioinput).length; i++) {
                    self.audioInputs.push(Object.values(devices.audioinput)[i]);
                    self.setSelectedAudio(Object.values(devices.audioinput)[i]);
                }
            }


            if (Object.values(devices.audiooutput).length) {
                self.audioOutputs = [];
                for (let i = 0; i < Object.values(devices.audiooutput).length; i++) {
                    self.audioOutputs.push(Object.values(devices.audiooutput)[i]);
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
                        audioInputId: self.getSelectedAudio(),
                        videoInputId: self.getSelectedCamera(),
                        constraints: {
                            audio: true,
                            video: {
                                frameRate: { min: 5, max: 25, ideal: 20 },
                                width: { min: '160', max: '1080', ideal: '640' },
                                height: { min: '120', max: '720', ideal: '480' }
                            }
                        }
                    };
                    console.log('######streamoptions', createStreamOptions);
                    self.ua
                        .createStream(createStreamOptions)
                        .then(function (stream) {
                            // Save local stream
                            self.currentLocalStream = stream;

                            const elmt = document.getElementById('local-container-placeholder');
                            if (elmt) {
                                elmt.remove();

                                stream.removeFromDiv('local-container', 'local-media');
                                stream.addInDiv('local-container', 'local-media', { width: '90%', height: '90%' }, true);
                            }
                            return resolve(stream);
                        })
                        .catch(function (err) {
                            //   self.errorMsg = 'create stream error' + err;
                            //   console.error(self.errorMsg);
                            console.error(err);
                            reject(err);
                        });
                });
            }
        };

        if (call) {
            // Switch the camera if call is ongoing
            this.releaseScreenSharingStream();
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
    changeAudioInput() {
        if (this.connectedConversation) {
            this.createWebcamAudioVideoStreams();
        }
    }
    changeWebcamInput(streamId) {
        console.log(streamId);
        this.setSelectedVideo(streamId);
        if (this.connectedConversation) {
            this.createWebcamAudioVideoStreams();
        }
    }
    call(calleeID) {
        const self = this;
        const registerInformation = {
            token: localStorage.getItem('token'),
            password: localStorage.getItem('apipass'),
            cloudFetchRetries: 3,
            cloudFetchRetryDelay: 2000
        };
        this.ua.register(registerInformation).then(function (session) {
            // Save session

            self.createWebcamAudioVideoStreams().then(s => {
                const contact = session.getOrCreateContact(calleeID);

                self.currentCall = contact.call(s, { preferVP9Codec: self.isVP9 });
                if (self.currentCall !== null) {
                    self.currentCall.on('localStreamAvailable', function (stream) {
                        console.log('localStreamAvailable');
                        // // document.getElementById('local-media').remove();
                        // addStreamInDiv(stream, 'local-container', 'local-media-' + stream.getId(), {width : '160px', height : '120px'}, true);
                        // stream
                        //     .on('stopped', function () { // When client receives an screenSharing call from another user
                        //         console.error('Stream stopped');
                        //         $('#local-media-' + stream.getId()).remove();
                        //     });
                    })
                        .on('streamAdded', function (stream) {
                            self.displayRemoteStream(stream);
                            // console.log('stream :', stream);
                            // const elmt = document.getElementById('remote-container');
                            // if (elmt) {
                            //     stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, { width: '100%', height: '100%' }, false);
                            // }
                            //  addStreamInDiv(stream, 'remote-container', 'remote-media-' + stream.getId(), {width : '640px', height : '480px'}, false);
                        })
                        .on('streamRemoved', function (stream) {
                            self.removeRemoteStream(stream);
                            // Remove media element
                            // document.getElementById('remote-media-' + stream.getId()).remove();
                        })
                        .on('userMediaError', function (e) {
                            console.log('userMediaError detected : ', e);
                            console.log('userMediaError detected with error : ', e.error);

                            // Checking if tryAudioCallActivated
                            // if (e.tryAudioCallActivated === false) {
                            //     $('#hangup-' + self.currentCall.getId()).remove();
                            // }
                        })

                        .on('hangup', function () {
                            self.hangup();
                        });

                } else {
                    console.warn('Cannot establish call');
                }
            });

        }).catch(function (error) {
            // error
            console.error('User agent registration failed', error);
        });
    }

    joinConference(conferenceName: string): void {

        const self = this;
        console.log('joining');
        self.joiningVideoCall = true;
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

            // const webRTCClient = self.apiRTC.session.createWebRTCClient({
            //     status : 'status' // Optionnal
            // });
            // webRTCClient.setPreferVP9Codec(true);
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
                    self.displayRemoteStream(stream);
                    // self.currentRemoteStreamID = stream;
                    // console.log('adding remote stream ', stream);
                    // const elmt = document.getElementById('remote-container');
                    // if (elmt) {
                    //     stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, { width: '100%', height: '100%' }, false);
                    // }
                    // document.getElementById('remote-container-placeholder').setAttribute('class', 'minimized');

                }).on('streamRemoved', function (stream) {
                    self.removeRemoteStream(stream);
                    // const elmt = document.getElementById('remote-container');
                    // if (elmt) {
                    //     stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
                    // }
                    // self.currentRemoteStreamID = null;
                });

            self.connectedConversation.join()
                .then(function (response) {
                    self.isConnected = true;
                    self.joiningVideoCall = false;
                    console.log('joined');
                    self.createWebcamAudioVideoStreams().then(s => {
                        self.connectedConversation.publish(s, null);
                    });

                    // self.connectedConversation.publish(self.currentLocalStream, createStreamOptions);
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


    releaseScreenSharingStream() {
        if (this.screensharingStream) {
            console.log('releasing screen sharing stream');
            this.connectedConversation.unpublish(this.screensharingStream);
            this.screensharingStream.release();
            this.screensharingStream = null;
        }
    }
    switchToScreeen() {

        const call = this.releaseCallStream(this.currentLocalStream);

        const callback = {
            getStream: () => {
                const self = this;
                return new Promise((resolve, reject) => {
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
                                    // document.getElementById('local-screensharing').remove();
                                    self.screensharingStream = null;
                                });
                                self.screensharingStream = stream;
                                self.currentLocalStream = stream;
                                return resolve(stream);
                            })
                            .catch(function (err) {
                                console.error('Could not create screensharing stream :', err);
                                reject();
                            });
                    } else {
                        return resolve(self.screensharingStream);

                    }
                });
            }
        };

        if (call) {
            console.log('On call: replacing stream');
            return call.replacePublishedStream(null, callback);
        } else {
            console.log('starting call');
            return callback.getStream();
        }
    }

    getCookieInfo(key: string, defaultValue: string): string {

        const res = localStorage.getItem(key);
        return (res) ? res : defaultValue;

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
    selectCamera(id: string) {
        localStorage.setItem('selectedCamera', id);
    }
    getSelectedCamera(): string {
        return localStorage.getItem('selectedCamera');
    }
    // getSelectedVideo() {
    //     return this.selectedvideo.id;
    // }
    getSelectedAudio() {
        const id = this.getCookieInfo('selectedAudioInput', 'default');
        return id;
        // for (let i = 0; i < this.audioInputs.length;i++)
        // {
        //     if (id === this.audioInputs[i].id ){
        //         return this.audioInputs[i];
        //     }
        // }
        // return null;
        // this.audioInputs
        // return this.selectedAudioInput;
    }
    setSelectedVideo(id: any) {
        console.log('changing video id from ', this.selectedvideo);
        this.selectedvideo = id;
        console.log('changing video id to ', this.selectedvideo);
    }
    setSelectedAudio(id: any) {
        this.selectedAudioInput = id;
    }
    onFlipFlopRemoteVideoStream() {
        localStorage.setItem('muteRemoteVideoStream', 'true');
        console.log(this.currentRemoteStreamID);
        if (this.currentRemoteStreamID) {
            if (this.currentRemoteStreamID.isVideoMuted()) {
                this.currentRemoteStreamID.unmuteVideo();
            } else {
                this.currentRemoteStreamID.muteVideo();
            }
        }
    }
    displayRemoteStream(stream) {
        this.currentRemoteStreamID = stream;
        console.log('adding remote stream ', stream);
        const elmt = document.getElementById('remote-container');
        if (elmt) {
            stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, { width: '100%', height: '100%' }, false);
        }
    }
    removeRemoteStream(stream) {
        const elmt = document.getElementById('remote-container');
        if (elmt) {
            stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
        }
        this.currentRemoteStreamID = null;
    }
}
