import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { WebRTCService } from '../../shared/services/webrtc/webrtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BandwidthComponent } from '../../shared/modules/bandwidth/bandwidth.component';

interface BPOCanvasElement extends HTMLCanvasElement {
  captureStream(fps: number): BPOStream;
}

interface BPOStream extends HTMLCanvasElement {
  addTrack (track);
}

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, OnDestroy, AfterViewInit {

  isLoading: false;
  joining: boolean;
  isLive = false;
  isConnected = false;
  errorMsg: string;
  apiRTC: any;
  ua = null;


  videoinputs: any[];
  audioinputs: any[];
  audiooutputs: any[];
  selectedaudio = '';
  selectedaudiooutput = '';
  selectedvideo = '';
  connectedSession = null;
  connectedConversation = null;
  contactList = null;
  currentLocalStream = null;
  call = null;
  currentStreamID = null;
  audioMuted = false;
  videoMuted = false;
  // upQoSs = [
  //   { label: 'Low', kbps: 100 },
  //   { label: 'Good', kbps: 700 },
  //   { label: 'Very good', kbps: 2000 }
  // ];
  subscribeOptions = {
    audioOnly: true,
    videoOnly: true
  };
  // defaultupstreamQuality = 100;
  currentUpQoS = 100;

  defaultDownQuality = 100;
  currentDownQoS = 100;
  contactCount: string;
  screensharingStream = null;
  captureSourceType: string;
  document: any;
  recordingInterview = false;
  remoteContact = 'Remote';
  cams = [{ id: 'cameo1', url: 'ws://' + location.hostname + ':2000/cameo' },
  { id: 'cameo2', url: 'ws://' + location.hostname + ':2001/cameo' }
  ];
  webrtc: WebRTCService = null;
  constructor(
    private translate: TranslateService,
    private scriptService: ScriptService,
    private modalService: NgbModal) {
      this.webrtc = new WebRTCService();
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
      this.initWebCams();

      self.isLoading = false;

    }).catch(error => self.errorMsg = error);

  }



  ngOnInit() {

  }
  addInDiv(containerId, stream) {
    const self = this;
    const id = 'webcam-' + stream.getLabels().videoSourceLabel;
    if (document.getElementById(id)) {
      console.log('aborting the insert as this webcam is already there ', id);
      return;
    }
    console.log('inserting element ', id);
    const container = document.getElementById(containerId);

    // Create media element
    const div = document.createElement('div');
    const mediaElement = document.createElement('video');

    mediaElement.id = id;
    mediaElement.width = 320;
    mediaElement.height = 180;
    mediaElement.className = 'local';
    mediaElement.autoplay = true;
    mediaElement.muted = true;

    mediaElement.addEventListener('click', function () {
      self.publishThisStream(stream);
    });

    // Add media element to media container
    div.appendChild(mediaElement);
    container.appendChild(div);

    // Attach stream
    stream.attachToElement(mediaElement);
  }
  displayWebCams(cam): void {
    const self = this;
    const createStreamOptions = { 'videoInputId': cam.id };
    this.ua.createStream(createStreamOptions)
      .then(function (stream) {
        self.addInDiv('webcams', stream);
        // self.currentLocalStream = stream;
        self.currentLocalStream = stream;
      })
      .catch(function (err) {
        console.error('create stream error', err);
      });
  }
  ngAfterViewInit(): void {

    const self = this;
    // const self = this;
    this.cams.forEach(cam => {
      const canvas = document.getElementById(cam.id);
      const player = new JSMpeg.Player(cam.url, {
        canvas: document.getElementById(cam.id),
        poster: '/assets/images/white-noise.jpg',
        audio: false
      });
      canvas.addEventListener('click', function () {
        self.switchToCamera(cam.id);
      });

    });



  }
  ngOnDestroy() {
    console.log('ondestroy');
    this.hangup();
  }

  getCookieInfo(key: string): string {
    return localStorage.getItem(key);
  }

  initWebCams() {
    const self = this;

    self.ua.on('mediaDeviceChanged', function (updatedContacts) {
      console.log('mediaDeviceChanged');
      const devices = self.ua.getUserMediaDevices();
      if ( ! devices) {
        console.log('No I/O User Media Devices');
      }
      if ( Object.values(devices.videoinput).length ) {
        self.videoinputs = [];
      
        for (let i = 0; i < Object.values(devices.videoinput).length; i++) {
          const wc = Object.values(devices.videoinput)[i];
          self.videoinputs.push(wc);
          self.displayWebCams(wc);
        }
        self.selectedvideo = self.videoinputs[0].id;
      }
      if ( Object.values(devices.audioinput).length){
        self.audioinputs = [];
        for (let i = 0; i < Object.values(devices.audioinput).length; i++) {
          self.audioinputs.push(Object.values(devices.audioinput)[i]);
        }
        self.selectedaudio = self.audioinputs[0].id;
      }

      if ( Object.values(devices.audiooutput).length) {
        self.audiooutputs = [];
        for (let i = 0; i < Object.values(devices.audiooutput).length; i++) {
          self.audiooutputs.push(Object.values(devices.audiooutput)[i]);
        }
        self.selectedaudiooutput = self.audiooutputs[0].id;
      }
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
          cloudUrl: this.webrtc.cloudUrl
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
      self.errorMsg = err;
      self.isConnected = false;
    });
    // });
  }

  changeAudioInput($event) {
    this.selectedaudio = $event.value;
    if (this.connectedConversation) {
      this.createWebcamAudioVideoStreams();
    }
  }
  onMutingVideo(mute) {
    this.videoMuted = mute;
    if ( !this.currentLocalStream) {
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
    if ( !this.currentLocalStream) {
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
  // changeUpStreamQuality($event) {
  //   this.currentUpQoS = $event.value;
  // }

  // changeDownStreamQuality($event) {
  //   this.currentDownQoS = $event.value;
  // }
  onNetwork() {
    const modalRef = this.modalService.open(BandwidthComponent, {
      size: 'lg',
      backdropClass: 'light-blue-backdrop',
      centered: true
    });
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

  releaseCallStream(stream): any {
    if (null === this.connectedConversation) {
      return null;
    }
    if (null === stream) {
      return null;
    }
    const call = this.connectedConversation.getConversationCall(stream);

    // if (stream !== null) {

    //   stream.release();
    //   stream = null;
    // }
    return call;
  }

  publishThisStream(stream) {
    this.selectedvideo = stream;
    if (!this.connectedConversation) {
      console.log('no conversation. Stream publication aborted', stream);
      return;
    }
    const call = this.releaseCallStream(this.currentLocalStream);

    if (call) {
      // Switch the camera if call is ongoing
      call.replacePublishedStream(stream);
      this.currentLocalStream = stream;
    }
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

  switchToCamera(cam: string) {

    const call = this.releaseCallStream(this.currentLocalStream);

    const callback = {
      getStream: () => {
        const self = this;
        return new Promise((resolve, reject) => {

          const videoToStreamElt = <BPOCanvasElement>document.getElementById(cam);
          const fps = this.getLocalStorageNumber('localCameraCaptureFps', 25);
          const cameraStream = <BPOStream> videoToStreamElt.captureStream(fps);
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (mediaStream) {
              const audioTracks = mediaStream.getAudioTracks();
              cameraStream.addTrack(audioTracks[0]);
              self.ua.createStreamFromMediaStream(cameraStream)
                .then(function (stream) {
                  // Save local stream
                  console.log('created stream from', cam);
                  self.currentLocalStream = stream;
                  return resolve(stream);
                })
                .catch(function (err) {
                  self.errorMsg = 'create stream error' + err;
                  console.error(self.errorMsg);

                  reject();
                });
            });
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


}

