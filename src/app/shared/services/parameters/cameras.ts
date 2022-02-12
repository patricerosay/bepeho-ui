import { Injectable } from '@angular/core';
import { Camera } from '../../interfaces/camera-interface';
import { HttpClient } from '@angular/common/http';
declare var document: any;

@Injectable()
export class Cameras {
    private url = '/api/devices/cameras/';


    constructor(public http: HttpClient) { }

    getCameras(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.get(this.url+'?'+Math.random()).subscribe(data => {
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

        }).catch(e=>{
            console.log('getCameras', e.errorMsg);
        });
    }
    showCamera(id) {
        const b = localStorage.getItem(id);
        if (!b) {
            return true;
        } else {
            return 'true' === b;
        }
    }
}
