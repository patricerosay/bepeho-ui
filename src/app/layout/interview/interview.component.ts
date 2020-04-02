import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { WebRTCService } from '../../shared/services/webrtc/webrtc.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BandwidthComponent } from '../../shared/modules/bandwidth/bandwidth.component';

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

  cams = [{ id: 'cameo1', url: 'ws://' + location.hostname + ':2000/cameo' },
  { id: 'cameo2', url: 'ws://' + location.hostname + ':2001/cameo' }
  ];
  webrtc: WebRTCService = null;
  constructor(
    private translate: TranslateService,

    private modalService: NgbModal) {
    const self = this;
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    this.webrtc = new WebRTCService();
    this.webrtc.load().then(r => {
      self.webrtc.initWebCams();
      self.isLoading = false;
    });

  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    const self = this;

    this.cameras.changes.subscribe(c => {
      console.log('camera event',c );
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
      console.log('Webcam event',wc );
      wc.forEach((v, k) => {
        self.webcams.forEach(e => {
           if (e.nativeElement.id === v.nativeElement.id) {
            this.webrtc.assignWebcams (e.nativeElement);
           }
        });
      });
    });
  }

  ngOnDestroy() {
    console.log('ondestroy');
    this.webrtc.hangup();
  }

  onNetwork() {
    const modalRef = this.modalService.open(BandwidthComponent, {
      size: 'lg',
      backdropClass: 'light-blue-backdrop',
      centered: true
    });
  }

  switchToCamera(cam: string) {

    const call = this.webrtc.releaseCallStream(this.webrtc.currentLocalStream);

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

