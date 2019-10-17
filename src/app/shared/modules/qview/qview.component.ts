import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VgAPI } from 'videogular2/compiled/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISegment, IVideo, IAudio } from './segment-interface';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
// import { FormControl, Validators } from '@angular/forms';

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
                    <input matInput matNativeControl required #input [(ngModel)]="newClipName" maxlength="30" placeholder="Enter new clip name">
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
  newClipName = 'clip ' + formatDate(new Date(), 'yyyy-MM-dd:HHMMSS', 'en');

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
    '../../../../../node_modules/videogular2/fonts/videogular.css',
  ]
})



export class QviewComponent implements OnInit {
  headerMessage: string;
  errorMsg: string;
  json: string;
  // segments: ISegment[];
  route: ActivatedRoute;
  isLoading = true;
  currentIndex = 0;
  segment: ISegment;
  videoApi: VgAPI;
  audioApi: VgAPI;
  titles: string;
  data: any[];
  currentVideo: IVideo;
  currentAudio: IAudio;
  currentTime = 0;
  newClipNamePlaceHolder: string;
  newClipName: string;
  style: number;
  nmea: NMEA [] ;
  displayedColumns = ['bgs', 'bgd'];

  constructor(public http: HttpClient,
    public activeModal: NgbActiveModal,
    private _ngZone: NgZone,
    public dialog: MatDialog,
    private modalService: NgbModal) {

  }
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  ngOnInit() {

    if (!this.json) {
      return;
    }
    this.segment = JSON.parse(this.json).segments[0] as ISegment;
    this.currentVideo = this.segment.videos[this.currentIndex];
    this.currentAudio = this.segment.audios[0];
    this.headerMessage = 'Recorded ' + this.data['start_time'];
    this.nmea = [
        {date: formatDate(this.data['start_time'], 'MM/dd/yyyy hh:mm', 'en'),
        name: this.data['GroupID'],
        bgs: this.data['nmea_d_bgs_d'],
        bgd: this.data['nmea_d_bgt_d']}];
    this.isLoading = false;

  }
  onVideoPlayerReady(api: VgAPI) {
    this.videoApi = api;

    this.videoApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    this.videoApi.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));

  }
  onPlayedAudio(event: any) {
    this.videoApi.play();
  }
  onPausedAudio(event: any) {
    this.videoApi.pause();
  }
  onUpdateAudioState(event: any) {
    this.videoApi.play();
  }
  onSeeked(event: any) {
    this.videoApi.seekTime(this.currentTime);
  }
  onEnded(event: any) {
    this.videoApi.pause();
  }
  onRateChaged(event: any) {
    console.log(event.type);
    this.videoApi.playbackRate = this.audioApi.playbackRate;
  }

  onAudioPlayerReady(api: VgAPI) {
    this.audioApi = api;
    this.audioApi.subscriptions.play.subscribe(this.onPlayedAudio.bind(this));
    this.audioApi.subscriptions.pause.subscribe(this.onPausedAudio.bind(this));
    this.audioApi.subscriptions.ended.subscribe(this.onEnded.bind(this));
    this.audioApi.subscriptions.error.subscribe(this.onEnded.bind(this));
    this.audioApi.subscriptions.rateChange.subscribe(this.onRateChaged.bind(this));
    this.audioApi.subscriptions.seeked.subscribe(this.onSeeked.bind(this));
    this.audioApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    this.audioApi.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
    this.audioApi.subscriptions.timeUpdate.subscribe(data => {
      this.currentTime = data.srcElement.currentTime;
    });
  }
  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.segment.videos.length) {
      this.currentIndex = 0;
    }

    this.currentVideo = this.segment.videos[this.currentIndex];
  }

  playVideo() {
    this.videoApi.seekTime(this.currentTime);
    this.videoApi.play();
    this.audioApi.seekTime(this.currentTime);
    this.audioApi.play();
  }

  onClickPlaylistItem(item: IVideo, index: number) {
    this.currentIndex = index;
    this.currentVideo = item;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  // "{"beginEnd":[0,120],"archive":true,"clipName":"coolx1-8-10-2019_9-11","clipDuration":120,
  // "videos":[{"position":0,"duration":40,"id":"Cam111478880586","segment":"1478880586"},
  // {"position":1,"duration":40,"id":"Cam121478880586","segment":"1478880586"},
  // {"position":2,"duration":40,"id":"Cam131478880586","segment":"1478880586"}],
  // "audios":[{"position":0,"segment":"","duration":120,"id":"Ambiance1478880586",
  // "url":"http://localhost:8080/media/vault/streamrecords/Ambiance1478880586.mp3"}]}"
  onBuildClip() {
    const self = this;
    this.modalService.open(BuildSmartClipModal, { centered: true }).result.then((result) => {
      if ('' !== result) {
        [self.newClipName, self.style] = result.split('|');

        const clipDuration = self.data['Duration'];
        const slashDuration = clipDuration / (self.segment.videos.length * this.style);
        const buildOrder: Clip = {
          beginEnd: [0, clipDuration],
          archive: true,
          clipName: self.newClipName,
          clipDuration: clipDuration,
          videos: [],
          audios: [{
            position: 0, segment: '', duration: clipDuration, id: self.segment.audios[0].id,
            url: self.segment.audios[0].src
          }]
        };

        let inc = 0;
        for (let style = 0; style < self.style; style++) {
          self.segment.videos.forEach(video => {
            buildOrder.videos.push({ position: inc, duration: slashDuration, id: video.id, segment: self.data['GroupID'] });
            inc = inc + 1;
          });
        }
        self.http.post<any>('/recorder', 'action=FileSystem&verb=build&prm=' + JSON.stringify(buildOrder),
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }).subscribe(
            (res) => {
              console.log(res);
              self.errorMsg = 'Success';

            },
            (err) => {
              console.log(err);
              self.errorMsg = err.message;
            });
      }
    }, (reason) => {
      console.log('dismissed' + reason);
    });


  }
  onExportSegment() {
    let ids = [];
    this.segment.audios.forEach(audio => {
      ids.push (audio.id);
    });
    this.segment.videos.forEach(video => {
      ids.push (video.id);
    });
    ids.push (this.data['GroupID']);

    this.http.post<any>('/recorder', 'action=FileSystem&verb=get&prm=' + ids.join(','),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).subscribe(
        (res) => {
          console.log(res);
          this.headerMessage = 'Success';

        },
        (err) => {
          console.log(err);
          this.headerMessage = err.message;
        });
  }

}


