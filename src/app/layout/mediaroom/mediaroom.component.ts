import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';


@Component({
  selector: 'app-mediaroom',
  templateUrl: './mediaroom.component.html',
  styleUrls: ['./mediaroom.component.scss']
})
export class MediaroomComponent implements OnInit {
  isLoading = true;
  isLive = false;
  isConnected = false;
  errorMsg: string;
  apiRTC: any;
  ua = null;
  cloudUrl = 'https://cloud.apizee.com';
  apikey = 'apzkey:a56f6c0e185ada4f0b1abbe563c8a37a';
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
    {label: 'Low', kbps: 100},
    {label: 'Good', kbps: 700},
    {label: 'Very good', kbps: 2000}
  ];
  subscribeOptions = {
    audioOnly: true,
    videoOnly: true
  };
  defaultupstreamQuality = 100;
  currentUpQoS = 100;

  defaultDownQuality = 100;
  currentDownQoS = 100;

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
      self.initConference();
      self.isLoading = false;

    }).catch(error => self.errorMsg = error);

  }


  ngOnInit() {

    const self = this;
  }

  initConference() {
    const self = this;

    this.ua = new this.apiRTC.UserAgent({
      uri: this.apikey
    });


    this.ua.on('mediaDeviceChanged', function (updatedContacts) {
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
  getStream() {
    const self = this;
    return new Promise((resolve, reject) => {
      const createStreamOptions = {
        audioInputId: self.selectedaudio,
        videoInputId: self.selectedvideo,
      };
      self.ua.createStream(createStreamOptions)
        .then(function (stream) {
          // Save local stream
          self.localStream = stream;

          document.getElementById('local-container-placeholder').setAttribute('class', 'minimized');
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);
          return resolve(stream);
        })
        .catch(function (err) {
          self.errorMsg = err;
        });
    });
  }

  createStream() {
    this.ua.setOverallOutgoingVideoBandwidth(this.currentUpQoS);
    this.ua.setOverallIncomingVideoBandwidth(this.currentDownQoS);
    if (this.localStream !== null) {
      this.call = this.connectedConversation.getConversationCall(this.localStream);
      this.localStream.release();
    }

    if (this.call !== null) {
      // Switch the camera if call is ongoing
      return this.call.replacePublishedStream(null, this.getStream());
    } else {
      return this.getStream();
    }
  }
  hangup(): void {
    this.ua.unregister({
      cloudUrl: this.cloudUrl
    });
    if (this.localStream) {
      this.localStream.release();
      this.localStream = null;
    }
    if (this.connectedConversation) {
      this.connectedConversation.leave();
      this.connectedConversation = null;
    }
    if (this.connectedSession) {
      this.connectedSession.disconnect();
      this.connectedSession = null;
    }
    this.isLive = false;
    self.isConnected = false;
    // document.getElementById('local-container-placeholder').setAttribute('class', 'camera');
    //document.getElementById('local-media').setAttribute('class', 'minimized');

  }
  joinConference(conferenceName: string): void {


//    this.initConference();

    const self = this;
    this.ua.register({
      cloudUrl: this.cloudUrl
    }).then(function (session) {
      self.connectedSession = session;
      self.isConnected = true;
      self.connectedSession
        .on('contactListUpdate', function (updatedContacts) {
          // console.log('MAIN - contactListUpdate', updatedContacts);
          if (self.connectedConversation !== null) {
            self.contactList = self.connectedConversation.getContacts();
            self.isLive = 0 < Object.values(self.contactList).length;
          }
        });


      self.connectedConversation = self.connectedSession.getConversation(conferenceName);

      self.connectedConversation
        .on('streamListChanged', function (streamInfo) {
          if (streamInfo.listEventType === 'added') {
            if (streamInfo.isRemote === true) {

              self.connectedConversation.subscribeToMedia(streamInfo.streamId)
                .then(function () {
                  console.log('subscribeToMedia success');
                }).catch(function (err) {
                  self.errorMsg = err;
                });
            }
          }
        });

      self.connectedConversation
        .on('streamAdded', function (stream) {
          self.currentStreamID = stream;
          stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
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

      self.createStream()
        .then(function (stream) {

          self.connectedConversation.join()
            .then(function (response) {

              const options = {};
              // options.qos.videoForbidInactive = true;
              // options.qos.videoMinQuality = 'medium';

              self.connectedConversation.publish(stream, options);
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
      this.createStream();
    }
  }
  changeAudioInput($event) {
    this.selectedaudio = $event.value;
    if (this.connectedConversation) {
      this.createStream();
    }
  }
  onVideoInStream($event) {
    if ($event.checked) {
      this.localStream.unmuteVideo();
    } else {
      this.localStream.muteVideo();
    }
  }
  onAudioInStream($event) {
    if ($event.checked) {
      this.localStream.unmuteAudio();
    } else {
      this.localStream.muteAudio();
    }
  }


  getAudio($event) {
    const self = this;
    this.subscribeOptions.audioOnly = $event.checked;
    this.connectedConversation.subscribeToStream(this.currentStreamID, this.subscribeOptions)
      .then(function (stream) {
        console.log('subscribeToStream success');
      }).catch(function (err) {
        self.errorMsg = err;
      });
  }
  getVideo($event) {
    const self = this;
    this.subscribeOptions.videoOnly = $event.checked;
    this.connectedConversation.subscribeToStream(this.currentStreamID, this.subscribeOptions)
      .then(function (stream) {
        console.log('subscribeToStream success');
      }).catch(function (err) {
        self.errorMsg = err;
      });
  }
  changeUpStreamQuality($event) {
    this.currentUpQoS = $event.value;
  }

  changeDownStreamQuality($event) {
    this.currentDownQoS = $event.value;
  }
}
