import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISegment, IVideo, IAudio } from '../../interfaces/segment-interface';
import { VgAPI } from 'ngx-videogular';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';



@Component({
    selector: 'app-sequence',
    templateUrl: './sequence.component.html',
    styleUrls: ['./sequence.component.scss']
})


export class SequenceComponent implements OnInit {
    @Input() sequence: any[];
    @Input() currentIndex: number;
    @Output() event: EventEmitter<any> = new EventEmitter();

    headerMessage: string;
    errorMsg: string;
    json: string;

    // route: ActivatedRoute;
    groupID = 0;
    isLoading = true;
    // currentIndex = 0;
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

    constructor(private _ngZone: NgZone) {  }

    @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

    ngOnInit() {
    const self = this;
      if (!this.sequence) {
        return;
      }
      this.groupID = this.sequence[0]['GroupID'];
      this.segment = new ISegment ;
      this.segment.audios = [];
      this.segment.videos = [];
      this.sequence.forEach(clip =>{
          if ('audio/mpeg' === clip['mime']) {
            self.segment.audios.push (clip);
          } else  {
            self.segment.videos.push(clip);
          }

      });
      this.segment.videos.sort( (a,b) =>
           a['Channel'].localeCompare(b['Channel'])
      );
      this.currentVideo = this.segment.videos[this.currentIndex];
      this.currentAudio = this.segment.audios[0];
      // this.headerMessage = 'Recorded ' + this.data['start_time'];

      this.isLoading = false;

    }
    getCurrentVideoSrc(): string {
        return '/media/' + this.currentVideo['filename_p_file'];
    }
    getCurrentPoster(): string {
        return '/media/' + this.currentVideo['filename_i_file'];

    }
    getCurrentAudioSrc(): string{
        return '/media/' + this.currentAudio['filename_m_file'];

    }
    onPlayedVideo(event: any) {
      // console.log("on played video");
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
      // console.log("on ended");
      this.videoApi.play();
      }
    }
    onSeeked(event: any) {
      // console.log("on seeked");
      if (this.audioApi) {
      this.audioApi.seekTime(this.currentTime);
      }
    }
    onEnded(event: any) {
      if (this.audioApi) {
      this.audioApi.pause();
      // console.log("on ended");
      }
    }
    onRateChaged(event: any) {
      // console.log(event.type);
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
      // this.videoApi.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
      // this.videoApi.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
      this.videoApi.subscriptions.timeUpdate.subscribe(data => {
        if (0 !== data.srcElement.currentTime ) {
        if ( self.currentSrc === data.srcElement.currentSrc ) {
          self.currentTime = data.srcElement.currentTime;
          // console.log('assigning currentime to ' + self.currentTime);
        } else {
          // console.log('changing video');
          self.currentSrc = data.srcElement.currentSrc;
          // self.seekToCurrentTime();
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
      // console.log('seektocurrent time   ' + this.currentTime);
      this.videoApi.seekTime(this.currentTime);
      if (this.audioApi) {
      this.audioApi.seekTime(this.currentTime);
      }
    }
    playVideo() {
      // console.log('playvideo');
      this.videoApi.play();
      if ( null !== this.audioApi) {
        this.audioApi.play();
      }
      this.seekToCurrentTime();
    }

    onClickPlaylistItem(item: IVideo, index: number) {
      // console.log('click item');
      this.currentIndex = index;
      this.currentVideo = item;
      // this.seekToCurrentTime();
    }

    triggerResize() {
      // Wait for changes to be applied, then trigger textarea resize.
      this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
    }



}
