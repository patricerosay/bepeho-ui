import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, } from '@angular/common/http';

import { Camera } from './camera-interface';

@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit {

    constructor(public http: HttpClient) { }
    private url = '/recorder/cams';
    isLoading=false;
    cameras: Camera[];
ngOnInit() {
        var self = this;

        this.http.get(this.url)
            .subscribe(
                data => {
                   self.cameras = data as Camera[];
                   self.isLoading=false;
                },
            );

    }

}
