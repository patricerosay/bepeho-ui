import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { WebRTCService } from '../../shared/services/webrtc/webrtc.service';
import { MatDialog } from '@angular/material/dialog';
import { BandwidthComponent } from '../../shared/modules/bandwidth/bandwidth.component';
import { AdressbookComponent } from '../../shared/modules/adressbook/adressbook.component';
import { WebrtcConfigComponent } from '../../shared/modules/webrtc-config/webrtc-config.component';
import { Cameras } from '../../shared/services/parameters/cameras';
import { HttpClient } from '@angular/common/http';
interface BPOCanvasElement extends HTMLCanvasElement {
  captureStream(fps: number): BPOStream;
}

interface BPOStream extends HTMLCanvasElement {
  addTrack(track);
}

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit,
  OnDestroy, AfterViewInit {
  @ViewChildren('cameras') cameras: QueryList<any>;
  @ViewChildren('webcams') webcams: QueryList<any>;
  isLoading = true;
  errorMsg: string;
  document: any;
  calleeID: number;
  // selectedCamera: string;
  //  cams = [{ id: 'cameo1', url: 'wss://' + location.hostname + '/wss2001' },
  //  { id: 'cameo2', url: 'wss://' + location.hostname + '/wss2002' },
  //  { id: 'cameo3', url: 'wss://' + location.hostname + '/wss2003' },
  //  ];
  cams = [
  ];
  webrtc: WebRTCService = null;
  public cameraService: Cameras = null;
  constructor(
    private translate: TranslateService,
    public http: HttpClient,
    private modalService: MatDialog) {
    const self = this;
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    this.webrtc = new WebRTCService();
    this.webrtc.load().then(r => {
      self.webrtc.initWebCams();
      this.cameraService = new Cameras(http);
      self.cameraService.getCameras().then(cams => {
        const i = 1;
        cams.forEach(element => {
          self.cams.push({
            id: element.id,
            // url: 'wss://' + location.hostname + '/wss200' + i++
            url: 'ws://' + location.hostname + ':2001/cameo'
          });
        });
        self.isLoading = false;
      });

      self.isLoading = false;
    });

  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    const self = this;

    this.cameras.changes.subscribe(c => {
      console.log('camera event', c);
      c.forEach((v, k) => {
        self.cams.forEach(e => {
          if (e.id === v.nativeElement.id) {
            const url = e.url;
            const player = new JSMpeg.Player(url, {
              canvas: v.nativeElement,
              poster: 'assets/images/white-noise.jpg',
              audio: false
            });
          }
        });
      });
    });

    this.webcams.changes.subscribe(wc => {
      console.log('Webcam event', wc);
      wc.forEach((v, k) => {
        self.webcams.forEach(e => {
          if (e.nativeElement.id === v.nativeElement.id) {
            this.webrtc.assignWebcams(e.nativeElement);
          }
        });
      });
      // if(wc.last){
      //   this.selectCamera(wc.last.nativeElement.id);
      // }
    });
  }

  ngOnDestroy() {
    console.log('ondestroy');
    this.webrtc.hangup();
    this.webrtc.releaseWebCams();
  }

  onSettings() {
    const self = this;
    const modalRef = this.modalService.open(WebrtcConfigComponent, {
      // size: 'lg',
      backdropClass: 'light-blue-backdrop',
      // centered: true
    });
    modalRef.componentInstance.audioInputs = this.webrtc.audioInputs;
    modalRef.componentInstance.audioOutputs = this.webrtc.audioOutputs;
    modalRef.afterClosed().subscribe(result => {
      console.log(result);
      self.webrtc.changeAudioInput();
    }, (reason) => {
      console.log(reason);
      self.webrtc.changeAudioInput();
    });
  }

  onNetwork() {
    const modalRef = this.modalService.open(BandwidthComponent, {
      // size: 'lg',
      backdropClass: 'light-blue-backdrop',
      // centered: true
    });
  }

  onCall() {

    const modalRef = this.modalService.open(AdressbookComponent, {
      // size: 'lg',
      backdropClass: 'light-blue-backdrop',
      data: this.calleeID

      // centered: true
    });
    modalRef.afterClosed().subscribe(calleeID => {
      console.log('Callee ID', calleeID);
      this.webrtc.call(calleeID);
    });
  }
  switchToCamera(cam: string) {
    if (this.webrtc.currentCall) {
      // 1 to 1 call
      const callback = {
        getStream: () => {
          const self = this;
          return new Promise((resolve, reject) => {

            const videoToStreamElt = <BPOCanvasElement>document.getElementById(cam);
            const fps = this.webrtc.getLocalStorageNumber('localCameraCaptureFps', 25);
            const cameraStream = <BPOStream>videoToStreamElt.captureStream(fps);
            const constraintsSet = localStorage.getItem('selectedConstraintSet');
            let createStreamOptions: any = { audio: true };
            if (constraintsSet) {
              createStreamOptions = JSON.parse(constraintsSet);
            }
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(function (mediaStream) {
                const audioTracks = mediaStream.getAudioTracks();
                cameraStream.addTrack(audioTracks[0]);
                self.webrtc.ua.createStreamFromMediaStream(cameraStream)
                  .then(function (stream) {
                    // Save local stream
                    console.log('created stream from', cam);
                    self.webrtc.currentLocalStream = stream;
                    return resolve(stream);
                  })
                  .catch(function (err) {
                    self.errorMsg = 'create stream error' + err;
                    console.error(self.errorMsg);

                    reject();
                  })
                  .catch(function (err) {
                    console.log(err.name + ': ' + err.message);
                  });

              });
          });
        }
      };

      if (this.webrtc.currentCall) {
        console.log('On call: replacing stream');
        this.webrtc.releaseScreenSharingStream();
        return this.webrtc.currentCall.replacePublishedStreams(null, callback).
        then(res => { 
          console.log('replaced by ', res);
        })
          .catch(err => {
            console.error('error while replacing stream ', err); }
            );
      } else {
        console.log('starting call');
        return callback.getStream();
      }
    } else {
      const call = this.webrtc.releaseCallStream(this.webrtc.currentLocalStream);
      // 1 to many video conf
      const callback = {
        getStream: () => {
          const self = this;
          return new Promise((resolve, reject) => {

            const videoToStreamElt = <BPOCanvasElement>document.getElementById(cam);
            const fps = this.webrtc.getLocalStorageNumber('localCameraCaptureFps', 25);
            const cameraStream = <BPOStream>videoToStreamElt.captureStream(fps);
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(function (mediaStream) {
                const audioTracks = mediaStream.getAudioTracks();
                cameraStream.addTrack(audioTracks[0]);
                self.webrtc.ua.createStreamFromMediaStream(cameraStream)
                  .then(function (stream) {
                    // Save local stream
                    console.log('created stream from', cam);
                    self.webrtc.currentLocalStream = stream;
                    return resolve(stream);
                  })
                  .catch(function (err) {
                    self.errorMsg = 'create stream error' + err;
                    console.error(self.errorMsg);

                    reject();
                  })
                  .catch(function (err) {
                    console.log(err.name + ': ' + err.message);
                  });

              });
          });
        }
      };

      if (call) {
        console.log('On call: replacing stream');
        this.webrtc.releaseScreenSharingStream();
        return call.replacePublishedStreams(null, callback).
          then(res => console.log('replaced by ', res))
          .catch(err => console.error('error while replacing stream ', err));
      } else {
        console.log('starting call');
        return callback.getStream();
      }
    }
  }
}

