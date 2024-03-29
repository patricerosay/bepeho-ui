import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VgAPI } from 'ngx-videogular';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISegment, IVideo, IAudio } from '../../interfaces/segment-interface';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { saveAs as importedSaveAs } from 'file-saver';

export interface Video {
  position: number;
  duration: number;
  id: string;
  segment: string;
}

export interface Audio {
  position: number;
  segment: string;
  duration: number;
  id: string;
  url: string;
}

export interface Clip {
  beginEnd: number[];
  archive: boolean;
  clipName: string;
  clipDuration: number;
  videos: Video[];
  audios: Audio[];
}
export interface NMEA {
  name: string;
  date: string;
  bgs: string;
  bgd: string;
}
@Component({
  template: `
      <div class="modal-header" >
        <h4 class="modal-title">Clip Building Parameters</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="nav navbar-nav  flex-nowrap ml-auto">
                <mat-form-field hintLabel="Min 5 and max 30 characters">
                    <input matInput matNativeControl required #input
                    [(ngModel)]="newClipName" maxlength="30" placeholder="Enter new clip name">
                    <mat-hint align="end">{{input.value?.length || 1}}/30</mat-hint>
                    <mat-error *ngIf="invalidClipNameError">{{invalidClipNameError}}</mat-error>

                </mat-form-field>
                <br/>
                <mat-form-field>
                    <mat-label>Clip Style</mat-label>
                    <select [(value)]="style" matNativeControl required [(ngModel)]="style">
                        <option value="1">Cool</option>
                        <option value="2">Dynamic</option>
                        <option value="4">Nervous</option>
                    </select>
                </mat-form-field>
            </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('')">Cancel</button>
        <button type="button" class="btn btn-outline-dark" (click)="onClose()">OK</button>
      </div>
    `
})


export class BuildSmartClipModal {
  newClipName = 'clip' + formatDate(new Date(), 'yyyy-MM-dd:HHMMSS', 'en');

  style = 1;
  invalidClipNameError: string = null;

  constructor(public activeModal: NgbActiveModal) {

  }

  public onClose() {
    if (this.newClipName.length >= 5) {
      this.activeModal.close(this.newClipName + '|' + this.style);
    } else {
      this.invalidClipNameError = 'Invalid parameters';
    }
  }

}
@Component({
  selector: 'app-qview',
  templateUrl: './qview.component.html',
  styleUrls: ['./qview.component.scss',
  ]
})



export class QviewComponent implements OnInit {
  headerMessage: string;
  public errorMsg: string;
  json: string;

  route: ActivatedRoute;
  isLoading = true;
  currentIndex = 0;
  segment: ISegment;
  videoApi: VgAPI;
  audioApi: VgAPI;
  titles: string;
  data: any[];
  currentVideo: IVideo = null;
  currentAudio: IAudio = null;
  currentTime = 0;
  currentSrc = null;
  newClipNamePlaceHolder: string;
  newClipName: string;
  style: number;
  public nmea: NMEA[];
  displayedColumns = ['date', 'bgs', 'bgd'];
  public isButtonDisabled = false;
  getlangage(): string {
    const langage = localStorage.getItem("langage");
    if (!langage) return this.translate.getBrowserLang();
    return langage;
  }
  constructor(public http: HttpClient,
    public activeModal: NgbActiveModal,
    private _ngZone: NgZone,
    private translate: TranslateService,
    private modalService: NgbModal) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.getlangage();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

  }
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  ngOnInit() {

    if (!this.json) {
      return;
    }
    const o = JSON.parse(this.json);
    this.segment = o.segments[0] as ISegment;
    this.currentVideo = this.segment.videos[this.currentIndex];
    this.currentAudio = this.segment.audios[0];
    const recordedDate = new Date(this.data['start_time']);
    this.nmea = [
      {
        date: this.data['start_time'],
        name: this.data['GroupID'],
        bgs: this.data['nmea_d_bgs_d'],
        bgd: this.data['nmea_d_bgt_d']
      }
    ];
    this.isLoading = false;

  }
  showDataBank() {
    return localStorage.getItem('show_video_bank');
  }
  onPlayedVideo(event: any) {
    if (this.audioApi) {
      this.audioApi.play();
    }
  }
  onPausedVideo(event: any) {
    if (this.audioApi) {
      this.audioApi.pause();
    }
  }
  onUpdateVideoState(event: any) {
    if (this.audioApi) {
      this.videoApi.play();
    }
  }
  onSeeked(event: any) {
    if (this.audioApi) {
      this.audioApi.seekTime(this.currentTime);
    }
  }
  onEnded(event: any) {
    if (this.audioApi) {
      this.audioApi.pause();
    }
  }
  onRateChaged(event: any) {
    if (this.audioApi) {
      this.audioApi.playbackRate = this.videoApi.playbackRate;
    }
  }
  onAudioPlayerReady(api: VgAPI) {
    this.audioApi = api;
  }
  onVideoPlayerReady(api: VgAPI) {
    const self = this;
    this.videoApi = api;
    this.videoApi.subscriptions.play.subscribe(this.onPlayedVideo.bind(this));
    this.videoApi.subscriptions.pause.subscribe(this.onPausedVideo.bind(this));
    this.videoApi.subscriptions.ended.subscribe(this.onEnded.bind(this));
    this.videoApi.subscriptions.error.subscribe(this.onEnded.bind(this));
    this.videoApi.subscriptions.rateChange.subscribe(this.onRateChaged.bind(this));
    this.videoApi.subscriptions.seeked.subscribe(this.onSeeked.bind(this));
    this.videoApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    this.videoApi.subscriptions.timeUpdate.subscribe(data => {
      if (0 !== data.srcElement.currentTime) {
        if (self.currentSrc === data.srcElement.currentSrc) {
          self.currentTime = data.srcElement.currentTime;
        } else {
          self.currentSrc = data.srcElement.currentSrc;
        }
      }

    });
  }

  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.segment.videos.length) {
      this.currentIndex = 0;
    }

    this.currentVideo = this.segment.videos[this.currentIndex];
  }

  seekToCurrentTime(): void {
    this.videoApi.seekTime(this.currentTime);
    if (this.audioApi) {
      this.audioApi.seekTime(this.currentTime);
    }
  }
  playVideo() {
    this.videoApi.play();
    if (this.audioApi) {
      this.audioApi.play();
    }
    this.seekToCurrentTime();
  }

  onClickPlaylistItem(item: IVideo, index: number) {
    this.currentIndex = index;
    this.currentVideo = item;

  }



  onBuildClip() {
    const self = this;

    this.modalService.open(BuildSmartClipModal, { centered: true }).result.then((result) => {
      if ('' !== result) {
        [self.newClipName, self.style] = result.split('|');

        const clipDuration = Number(self.data['Duration']);
        const slashDuration = clipDuration / (self.segment.videos.length * this.style);
        const buildOrder: Clip = {
          beginEnd: [0, clipDuration],
          archive: true,
          clipName: self.newClipName,
          clipDuration: clipDuration,
          videos: [],
          audios: []

        };
        if (0 < self.segment.audios.length) {
          buildOrder.audios = [{
            position: 0, segment: '', duration: clipDuration, id: self.segment.audios[0].id,
            url: self.segment.audios[0].src
          }]
        }
        let inc = 0;
        for (let style = 0; style < self.style; style++) {
          self.segment.videos.forEach(video => {
            buildOrder.videos.push({ position: inc, duration: slashDuration, id: video.id, segment: self.data['GroupID'] });
            inc = inc + 1;
          });
        }
        self.isButtonDisabled = true;
        self.http.post<any>('/recorder', 'action=FileSystem&verb=build&prm=' + JSON.stringify(buildOrder),
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }).subscribe(
            (res) => {
              console.log(res);
              self.errorMsg = 'Success';
              self.isButtonDisabled = false;

            },
            (err) => {
              console.log(err);
              self.errorMsg = err.message;
              self.isButtonDisabled = false;
            });
      }
    }, (reason) => {
      // console.log('dismissed' + reason);
    });


  }
  onSaveSegment() {
    const ids = [];
    const self = this;
    this.segment.audios.forEach(audio => {
      ids.push(audio.id);
    });
    this.segment.videos.forEach(video => {
      ids.push(video.id);
    });
    ids.push(this.data['GroupID']);
    self.isButtonDisabled = true;
    this.http.post<any>('/recorder', 'action=FileSystem&verb=keep&prm=' + ids.join(','),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).subscribe(
        (res) => {
          // console.log(res);
          self.errorMsg = 'Success';
          self.isButtonDisabled = false;

        },
        (err) => {
          // console.log(err);
          self.errorMsg = err.message;
          self.isButtonDisabled = false;
        });
  }
  onExportSegment() {
    const ids = [];
    const self = this;
    this.segment.audios.forEach(audio => {
      ids.push(audio.id);
    });
    this.segment.videos.forEach(video => {
      ids.push(video.id);
    });
    ids.push(this.data['GroupID']);
    self.isButtonDisabled = true;
    this.http.post<any>('/recorder', 'action=FileSystem&verb=get&prm=' + ids.join(','),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).subscribe(
        (res) => {
          // console.log(res);
          self.errorMsg = 'Success';
          self.isButtonDisabled = false;

        },
        (err) => {
          // console.log(err);
          self.errorMsg = err.message;
          self.isButtonDisabled = false;
        });
  }


  public downloadThisFile() {
    const self = this;
    try {
      var isFileSaverSupported = !!new Blob;


      self.isButtonDisabled = true;
      const rootName = self.data['start_time'] + '-';
      if (self.segment.audios && 0 < self.segment.audios.length)
        importedSaveAs('/media/' + self.segment.audios[0].src, rootName);
      if (self.segment.videos && self.segment.videos[self.currentIndex])
        importedSaveAs('/media/' + self.segment.videos[self.currentIndex].src, rootName + self.segment.videos[self.currentIndex].channel);

      const subtitles = "/media/subtitles/" + self.data['GroupID'] + ".vtt";
      importedSaveAs(subtitles, rootName);
      this.errorMsg = 'Downloaded';
    } catch (e) {
      this.errorMsg = 'not supported';
    }
    finally{
      self.isButtonDisabled = false;

    }
    
  }
  public downloadAll() {
    const self = this;
    try {
      var isFileSaverSupported = !!new Blob;
      const rootName = self.data['start_time'] + '-';
      self.segment.audios.forEach(audio => {
        importedSaveAs('/media/' + audio.src, rootName);
      });
      self.segment.videos.forEach(video => {
        importedSaveAs('/media/' + video.src, rootName + video.channel);
      });
      const subtitles = "/media/subtitles/" + self.data['GroupID'] + ".vtt";
      importedSaveAs(subtitles, rootName);
      this.errorMsg = 'Downloaded';
    } catch (e) {
      this.errorMsg = 'not supported';
    }
    finally{
      self.isButtonDisabled = false;

    }
  }

}


