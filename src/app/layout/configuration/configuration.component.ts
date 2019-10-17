import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import { Configuration, Property } from '../../shared/interfaces/configuration-interface';
import { HttpHeaders } from '@angular/common/http';

/** @title Configuration Pannel */
@Component({
    selector: 'app-map',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    animations: [routerTransition()]
})

export class ConfigurationComponent implements OnInit {

    general: Configuration[];
    advanced: Configuration[];
    cameras = new Map<string, Property[]>();
    webCameras = new Map<string, Property[]>();
    webMicrophones = new Map<string, Property[]>();
    microphones = new Map<string, Property[]>();
    isLoading = false;
    errorMsg: string;
    constructor(public http: HttpClient) { }
    private url = '/recorder/parameters';

    getMapKey(m: Map<string, Property[]>): string[] {
        return Array.from(m.keys());
    }

    getProperties(m: Map<string, Property[]>, key: string): Property[] {
        return m.get(key);
    }
    saveDevice(device: Map<string, Property[]>)
    {
        const params: URLSearchParams = new URLSearchParams();
        device.forEach((conf: Property[], key: string) => {
            if (null !== conf ) {
                conf.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });

        this.http.post<any>('/recorder', 'action=Parameter&verb=save&' + params,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).subscribe(
                (res) => {
                    console.log(res);
                    this.errorMsg = 'Success';

                },
                (err) => {
                    console.log(err);
                    this.errorMsg = err.message;
                });
    }
    saveProperties(configurations: Configuration[]) {
        const params: URLSearchParams = new URLSearchParams();
        configurations.forEach(conf => {
            if (null !== conf.props && conf.props.general) {
                conf.props.general.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
            if (null !== conf.props && conf.props.advanced) {
                conf.props.advanced.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });

        this.http.post<any>('/recorder', 'action=Parameter&verb=save&' + params,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).subscribe(
                (res) => {
                    console.log(res);
                    this.errorMsg = 'Success';

                },
                (err) => {
                    console.log(err);
                    this.errorMsg = err.message;
                });

    }

    ngOnInit() {
        const self = this;
        this.http.get('/recorder/parameters')
            .subscribe(
                data => {
                    const configurations = data as Configuration[];
                    self.advanced = [];
                    self.general = [];
                    configurations.forEach(conf => {
                        if (conf.props.advanced) {
                            self.advanced.push(conf);
                        }
                        if (conf.props.general) {
                            self.general.push(conf);
                        }
                        if (conf.props['Camera 1']) {
                            self.cameras.set('Camera 1', conf.props['Camera 1']);
                        }
                        if (conf.props['Camera 2']) {
                            self.cameras.set('Camera 2', conf.props['Camera 2']);
                        }
                        if (conf.props['Camera 3']) {
                            self.cameras.set('Camera 3', conf.props['Camera 3']);
                        }
                        if (conf.props['Camera 4']) {
                            self.cameras.set('Camera 4', conf.props['Camera 4']);
                        }
                        if (conf.props['Camera 5']) {
                            self.cameras.set('Camera 5', conf.props['Camera 5']);
                        }
                        if (conf.props['Camera 6']) {
                            self.cameras.set('Camera 6', conf.props['Camera 6']);
                        }
                        if (conf.props['WebCam 1']) {
                            self.webCameras.set('WebCam 1', conf.props['WebCam 1']);
                        }
                        if (conf.props['WebCam 2']) {
                            self.webCameras.set('WebCam 2', conf.props['WebCam 2']);
                        }

                        if (conf.props['Microphone 1']) {
                            self.microphones.set('Microphone 1', conf.props['Microphone 1']);
                        }
                        if (conf.props['Microphone 2']) {
                            self.microphones.set('Microphone 2', conf.props['Microphone 2']);
                        }

                        if (conf.props['WebMic 1']) {
                            self.webMicrophones.set('WebMic 1', conf.props['WebMic 1']);
                        }
                        if (conf.props['WebMic 2']) {
                            self.webMicrophones.set('WebMic 2', conf.props['WebMic 2']);
                        }
                    });

                    self.isLoading = false;
                },
            );
    }

}
