import { Component, OnInit } from '@angular/core';
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
    isLoading = true;
    cameras: Array<Camera> = new Array<Camera>();
    ngOnInit() {
        const self = this;
        // const self.cameras = new Camera[];
        this.http.get(this.url)
            .subscribe(
                data => {
                    // self.cameras
                    const tempCams = data as Camera[];
                    tempCams.forEach( function (cam) {
                        if (cam.camPreviewUrl) {
                            self.cameras.push(cam);
                        }
                    });
                    self.isLoading = false;
                },
            );

    }

}
