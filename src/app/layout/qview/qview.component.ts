import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { QviewParameters, Segment, Audio, Video } from './segment-interface';
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
    segments: Segment[];
    route: ActivatedRoute;
    isLoading = true;
    first: Segment;
    constructor(public http: HttpClient, private curroute: ActivatedRoute) {
        this.route = curroute;
    }

    ngOnInit() {

        this.json = atob(this.route.snapshot.queryParamMap.get('data'));
        const qvparams = JSON.parse(this.json) as QviewParameters;
        this.first = qvparams.segments[0];
        this.isLoading = false;
    }

}


