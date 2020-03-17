import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { repeat } from 'rxjs/operators';

interface BPOCanvasElement extends HTMLCanvasElement {
  captureStream(fps: number): void;
}

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  isLoading: false;
  joining: boolean;
  isLive = false;
  isConnected = false;
  errorMsg: string;
  apiRTC: any;
  ua = null;
  cloudUrl = 'https://cloud.apizee.com';
  // apikey = 'apzkey:a56f6c0e185ada4f0b1abbe563c8a37a';
  devices = null;
  videoinputs: any[];
  audioinputs: any[];
  audiooutputs: any[];
  selectedaudio = '';
  selectedaudiooutput = '';
  selectedvideo = '';
  connectedSession = null;
  connectedConversation = null;
  contactList = null;
  localStream = null;
  call = null;
  currentStreamID = null;
  upQoSs = [
    { label: 'Low', kbps: 100 },
    { label: 'Good', kbps: 700 },
    { label: 'Very good', kbps: 2000 }
  ];
  subscribeOptions = {
    audioOnly: true,
    videoOnly: true
  };
  defaultupstreamQuality = 100;
  currentUpQoS = 100;

  defaultDownQuality = 100;
  currentDownQoS = 100;
  contactCount: string;
  screensharingStream = null;
  captureSourceType: string;
  document: any;
  recordingInterview = false;
  remoteContact = 'Remote';
  constructor(
    private translate: TranslateService, private scriptService: ScriptService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    const self = this;
    scriptService.load('apizee').then(data => {
      self.apiRTC = window['apiRTC'];

      self.apiRTC.setLogLevel(0);

      const apikey = localStorage.getItem('apikey');
      this.ua = new this.apiRTC.UserAgent({
        uri: apikey,
      });

      // self.initConference();
      self.isLoading = false;

    }).catch(error => self.errorMsg = error);

  }



  ngOnInit() {

  }
  ngAfterViewInit(): void {

    const canvas: HTMLElement = document.getElementById('canvasID');
    const self = this;
    const mpeg = new JSMpeg.Player('ws://' + location.hostname + ':2000/api/stream', {
      canvas: canvas,
      poster: '/assets/images/white-noise.jpg',
      audio: false
    });

  }
  ngOnDestroy() {
    console.log('ondestroy');
    this.hangup();
  }

  getCookieInfo(key: string): string {
    return localStorage.getItem(key);
  }
  initConference() {
    const self = this;


    self.ua.on('mediaDeviceChanged', function (updatedContacts) {
      console.log('mediaDeviceChanged');
      self.videoinputs = [];
      self.devices = self.ua.getUserMediaDevices();
      for (let i = 0; i < Object.values(self.devices.videoinput).length; i++) {
        self.videoinputs.push(Object.values(self.devices.videoinput)[i]);
      }
      self.selectedvideo = self.videoinputs[0].id;

      self.audioinputs = [];
      for (let i = 0; i < Object.values(self.devices.audioinput).length; i++) {
        self.audioinputs.push(Object.values(self.devices.audioinput)[i]);
      }
      self.selectedaudio = self.devices.audioinput.default.id;


      self.audiooutputs = [];
      for (let i = 0; i < Object.values(self.devices.audiooutput).length; i++) {
        self.audiooutputs.push(Object.values(self.devices.audiooutput)[i]);
      }
      self.selectedaudiooutput = self.devices.audiooutput.default.id;
    });


  }
  removeDiv(id: string): void {
    const elmt = document.getElementById(id);
    if (elmt) {
      elmt.remove();
    }
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


  shareScreen() {
    console.log('on sharescreen');
    const self = this;
    if (self.screensharingStream === null) {
      let captureSourceType = [];
      if (self.apiRTC.browser === 'Firefox') {
        self.captureSourceType = 'screen';
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
      self.document.getElementById('local-screensharing').remove();
    }

  }

  hangup(): void {
    if (this.localStream) {
      this.localStream.release();
      this.localStream = null;
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

    this.initConference();

    this.ua.register(registerInformation).then(function (session) {
      console.log('registered');
      self.ua.setOverallOutgoingVideoBandwidth(self.getLocalStorageNumber('upload-kbps', 100));
      self.ua.setOverallIncomingVideoBandwidth(self.getLocalStorageNumber('download-kbps', 100));

      self.connectedSession = session;
      self.isConnected = true;
      self.connectedSession
        .on('contactListUpdate', function (updatedContacts) {
          // console.log('MAIN - contactListUpdate', updatedContacts);
          if (self.connectedConversation !== null) {
            self.contactList = self.connectedConversation.getContacts();
            self.isLive = 0 < Object.values(self.contactList).length;
            self.contactCount =
              'Connected users: ' + Object.values(self.contactList).length;
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
          document.getElementById('remote-container-placeholder').setAttribute('class', 'camera');
          stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
          self.currentStreamID = null;
        });

      // ==============================
      // CREATE LOCAL STREAM & JOIN CONVERSATION
      // ==============================
      const createStreamOptions = {
        constraints: {
          audio: true,
          video: true
        }
      };

      self.createWebcamAudioVideoStreams()
        .then(function (stream) {

          self.connectedConversation.join()
            .then(function (response) {
              self.isConnected = true;
              self.joining = false;
              console.log('joined');
              const options = {};
              // options.qos.videoForbidInactive = true;
              // options.qos.videoMinQuality = 'medium';

              self.connectedConversation.publish(stream, createStreamOptions);
            });

        }).catch(function (err) {
          self.errorMsg = err;
          self.isConnected = false;
        });
    });
  }

  changeVideoInput($event) {
    this.selectedvideo = $event.value;
    if (this.connectedConversation) {
      this.createWebcamAudioVideoStreams();
    }
  }
  changeAudioInput($event) {
    this.selectedaudio = $event.value;
    if (this.connectedConversation) {
      this.createWebcamAudioVideoStreams();
    }
  }
  onVideoInStream($event) {
    console.log('video audio');
    if ($event.checked) {
      this.localStream.unmuteVideo();
    } else {
      this.localStream.muteVideo();
    }
  }
  onAudioInStream($event) {
    console.log('push audio');
    if ($event.checked) {
      this.localStream.unmuteAudio();
    } else {
      this.localStream.muteAudio();
    }
  }


  getAudio($event) {
    console.log('get audio');
    const self = this;
    this.subscribeOptions.audioOnly = $event.checked;
    this.connectedConversation.subscribeToStream(this.currentStreamID, this.subscribeOptions)
      .then(function (stream) {
        console.log('subscribeToStream success');
      }).catch(function (err) {
        console.log(err);
        self.errorMsg = err;
      });
  }
  getVideo($event) {
    console.log('get video');
    const self = this;
    this.subscribeOptions.videoOnly = $event.checked;
    this.connectedConversation.subscribeToStream(this.currentStreamID, this.subscribeOptions)
      .then(function (stream) {
        console.log('subscribeToStream success');
      }).catch(function (err) {
        console.log(err);
        self.errorMsg = err;
      });
  }
  changeUpStreamQuality($event) {
    this.currentUpQoS = $event.value;
  }

  changeDownStreamQuality($event) {
    this.currentDownQoS = $event.value;
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

  releaseCallStream(ls):any {
    if(null === this.connectedConversation) {
      return null;
    }
    const call = this.connectedConversation.getConversationCall(ls);

    if (ls !== null) {

      ls.release();
      ls = null;
    }
    return call;
  }

  // getWebcamAudioVideoStreams(): Promise<any> {
  //   const self = this;
  //   return new Promise((resolve, reject) => {
  //     const createStreamOptions = {
  //       audioInputId: self.selectedaudio,
  //       videoInputId: self.selectedvideo,
  //       constraints: {
  //         video: {
  //           frameRate: { min: 5, max: 25, ideal: 20 },
  //           width: { min: '160', max: '1080', ideal: '640' },
  //           height: { min: '120', max: '720', ideal: '480' }

  //         }
  //       }
  //     };

  //     self.ua.createStream(createStreamOptions)
  //       .then(function (stream) {
  //         console.log('streaming webcam', stream);
         
  //           self.localStream = stream;
  //           self.removeDiv('local-container-placeholder');
  //           stream.removeFromDiv('local-container', 'local-media');
  //           stream.addInDiv(
  //             'local-container',
  //             'local-media',
  //             { width: '100%', height: '100%' },
  //             true
  //           );
          
  //         return resolve(stream);
  //       })
  //       .catch(function (err) {
  //         self.errorMsg = err;
  //         console.log(err);
  //         reject(err);
  //       });
  //   });
  // }

  // createWebCamStream() {

  //   if (this.localStream !== null) {
  //     this.call = this.connectedConversation.getConversationCall(this.localStream);
  //     this.localStream.release();
  //   }
  //   if (this.call !== null) {
  //     // Switch the camera if call is ongoing
  //     return this.call.replacePublishedStream(null, this.getWebcamAudioVideoStreams());
  //   } else {
  //     return this.getWebcamAudioVideoStreams();
  //   }
  // }
  createWebcamAudioVideoStreams() {
    // Release old stream if it exists
    const call = this.releaseCallStream(this.localStream);

    // if (this.localStream !== null) {
    //   call = this.connectedConversation.getConversationCall(
    //     this.localStream
    //   );
    //   this.releaseLocalStream(this.localStream);

    // }

    const callback = {
      getStream: () => {
        const self = this;
        return new Promise((resolve, reject) => {
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
         // self.createStreamOptions.videoInputId = self.selectedDevices.video.id;
         // self.createStreamOptions.audioInputId = self.selectedDevices.audio.id;
          console.log(createStreamOptions);
          self.ua
            .createStream(createStreamOptions)
            .then(function (stream) {
              // Save local stream
              self.localStream = stream;
              self.removeDiv('local-container-placeholder');
              stream.removeFromDiv('local-container', 'local-media');
              stream.addInDiv('local-container', 'local-media', { width: '90%', height: '90%' }, true);
              return resolve(stream);
            })
            .catch(function (err) {
              self.errorMsg = 'create stream error' + err;
              console.error(self.errorMsg);

              reject();
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
  switchToCamera() {
    // Release old stream if it exists
    const call = this.releaseCallStream(this.localStream);

    const callback = {
      getStream: () => {
        const self = this;
        return new Promise((resolve, reject) => {
   
       const videoToStreamElt = <BPOCanvasElement>document.getElementById('canvasID');
       const videoToStream = videoToStreamElt.captureStream(30);


       this.ua.createStreamFromMediaStream(videoToStream)
  //       console.log(createStreamOptions);
  //        self.ua.createStream(createStreamOptions)
            .then(function (stream) {
              // Save local stream
              self.localStream = stream;
              self.removeDiv('local-container-placeholder');
              stream.removeFromDiv('local-container', 'local-media');
              stream.addInDiv('local-container', 'local-media', { width: '90%', height: '90%' }, true);
              return resolve(stream);
            })
            .catch(function (err) {
              self.errorMsg = 'create stream error' + err;
              console.error(self.errorMsg);

              reject();
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
  // createCameraStream(): Promise<any> {
  //   const self = this;
  //   return new Promise((resolve, reject) => {

  //     const videoToStreamElt = <BPOCanvasElement>document.getElementById('canvasID');
  //     const videoToStream = videoToStreamElt.captureStream(30);


  //     this.ua.createStreamFromMediaStream(videoToStream)
  //       .then(function (stream) {
  //         console.log('streaming camera', stream);


  //         // self.createStream();
  //         self.localStream = stream;
  //         self.removeDiv('local-container-placeholder');
  //         stream.removeFromDiv('local-container', 'local-media');
  //         stream.addInDiv(
  //           'local-container',
  //           'local-media',
  //           { width: '100%', height: '100%' },
  //           true
  //         );
  //         return resolve(stream);
  //       })
  //       .catch(function (err) {
  //         console.error('create stream error', err);
  //         reject(err);
  //       });
  //   });
  // }
  // switchToCamera() {

  //   if (this.localStream !== null) {
  //     this.call = this.connectedConversation.getConversationCall(this.localStream);
  //     this.localStream.release();
  //   }

  //   if (this.call !== null) {
  //     // Switch the camera if call is ongoing

  //     return this.call.replacePublishedStream( null, this.createCameraStream());
  //   } else {
  //     return this.createCameraStream();
  //   }
  // }


}

