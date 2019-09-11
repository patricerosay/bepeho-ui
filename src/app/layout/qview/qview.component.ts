import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IQviewParameters, ISegment, IAudio, IVideo } from './segment-interface';
import { VgAPI, VgMedia } from '../../../../node_modules/videogular2/compiled/core';

// import { Source } from 'webpack-sources';

@Component({
    selector: 'app-qview',
    templateUrl: './qview.component.html',
    styleUrls: ['./qview.component.scss',
    '../../../../node_modules/videogular2/fonts/videogular.css',
]
})



export class QviewComponent implements OnInit {
    json: string;
    // segments: ISegment[];
    route: ActivatedRoute;
    isLoading = true;
    currentIndex = 0;
    segment: ISegment;
    api: VgAPI;

    currentItem: IVideo;

    constructor(public http: HttpClient, private curroute: ActivatedRoute) {
        this.route = curroute;
    }

    ngOnInit() {

        this.json = atob(this.route.snapshot.queryParamMap.get('data'));
        this.segment = JSON.parse(this.json).segments[0] as ISegment;
        this.currentItem = this.segment.videos[ this.currentIndex ];
        this.isLoading = false;

    }
    onPlayerReady(api: VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
        this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
    }

    nextVideo() {
        this.currentIndex++;

        if (this.currentIndex === this.segment.videos.length) {
            this.currentIndex = 0;
        }

        this.currentItem = this.segment.videos[ this.currentIndex ];
    }

    playVideo() {
        this.api.play();
    }

    onClickPlaylistItem(item: IVideo, index: number) {
        this.currentIndex = index;
        this.currentItem = item;
    }
}


