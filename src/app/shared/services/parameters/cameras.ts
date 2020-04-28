import { Injectable } from '@angular/core';
import { Camera } from '../../interfaces/camera-interface';
import { HttpClient } from '@angular/common/http';
declare var document: any;

@Injectable()
export class Cameras {
    private url = '/recorder/cams';


    constructor(public http: HttpClient) { }

    getCameras(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.get(this.url).subscribe(data => {
                const ret: Camera[] = [];
                const tempCams = data as Camera[];
                tempCams.forEach(function (cam) {
                    if ('CAM' === cam.type) {

                        if (cam.camPreviewUrl && cam.enabled) {
                            ret.push(cam);
                        }
                    }
                });

                ret.reverse();
                return (resolve(ret));
            });

        });
    }
}
