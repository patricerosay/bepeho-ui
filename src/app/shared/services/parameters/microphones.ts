import { Injectable } from '@angular/core';
import { Microphone } from '../../interfaces/microphone-interface';
import { HttpClient } from '@angular/common/http';
declare var document: any;

@Injectable()
export class Microphones {
    private url = '/api/devices/microphones/';


    constructor(public http: HttpClient) { }

    getMicrophones(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.get(this.url+'?'+Math.random()).subscribe(data => {
                const ret: Microphone[] = [];
                const tempCams = data as Microphone[];
                tempCams.forEach(function (cam) {
                    //if ('MIC' === cam.type) {

                        if ( cam.enabled) {
                            ret.push(cam);
                        }
                    //}
                });

                // ret.reverse();
                return (resolve(ret));
            });

        }).catch(e=>{
            console.log('getCameras', e.errorMsg);
        });
    }
    showMicrophone(id) {
        const b = localStorage.getItem(id);
        if (!b) {
            return true;
        } else {
            return 'true' === b;
        }
    }
}
