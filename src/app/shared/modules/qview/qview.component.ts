import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VgAPI, VgMedia } from 'videogular2/compiled/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISegment, IVideo } from './segment-interface';

@Component({
    selector: 'app-qview',
    templateUrl: './qview.component.html',
    styleUrls: ['./qview.component.scss',
    '../../../../../node_modules/videogular2/fonts/videogular.css',
]
})



export class QviewComponent implements OnInit {
    headerMessage:  string;
    json: string;
    // segments: ISegment[];
    route: ActivatedRoute;
    isLoading = true;
    currentIndex = 0;
    segment: ISegment;
    api: VgAPI;
    titles: string;
    data: any[];
    currentItem: IVideo;

    constructor(public http: HttpClient, private curroute: ActivatedRoute, public activeModal: NgbActiveModal) {
        this.route = curroute;
    }

    ngOnInit() {

        if (!this.json) {
            return;
        }
        this.segment = JSON.parse(this.json).segments[0] as ISegment;
        this.currentItem = this.segment.videos[ this.currentIndex ];
        this.isLoading = false;
        this.headerMessage = 'Viewing ' + this.data['start_time'];

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
    onBuildClip() {

    }
    onExportSegment() {

        this.http.post<any>('recorder', 'action=FileSystem&verb=get&prm=' + this.data['GroupID'],
            {
                headers: {
                'content-type': 'application/x-www-form-urlencoded'
            } }).subscribe(
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


