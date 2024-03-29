import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import { Configuration, Property, Controls } from '../../shared/interfaces/configuration-interface';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    template: `
        <div class="modal-header" >
          <h4 class="modal-title">Confirmation</h4>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
              <div class="nav navbar-nav  flex-nowrap ml-auto">
                Are your  sure you want to remove all records from the system ?
                  <br/>

              </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('')">Cancel</button>
          <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('OK')">Confirm</button>
        </div>
      `
  })


  export class ConfirmationModalDialog {

    constructor(public activeModal: NgbActiveModal) {

    }
  }

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
    isLoadingConf = true;
    isLoadingControls = true;
    errorMsg: string;

    getlangage(): string {    
        const langage = localStorage.getItem("langage");
        if (! langage) return this.translate.getBrowserLang();
        return langage;
    }
    controls = new Controls;
    constructor(public http: HttpClient,
        private modalService: NgbModal,
        private translate: TranslateService) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.getlangage();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
     }
    private url = '/api/parameters/';
    deleteAll() {
        const self = this;
        this.modalService.open(ConfirmationModalDialog, { centered: true }).result.then((result) => {
        if ( result) {
        this.http.post<any>('/recorder', 'action=System&verb=cleanup',
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
    });
    }
    cleanup() {
        this.http.post<any>('/recorder', 'action=FileSystem&verb=cleanup',
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
    onStopProcesses() {
        // postMessage('Process', '&verb=resume', location.reload());
    }

    getMapKey(m: Map<string, Property[]>): string[] {
        return Array.from(m.keys());
    }

    getProperties(m: Map<string, Property[]>, key: string): Property[] {
        return m.get(key);
    }

    showDataBank(){
        return localStorage.getItem('show_video_bank') === 'true';
    }
    toggleShowDataBank(event){
        if (event.checked){
            localStorage.setItem('show_video_bank', 'true');
        }else{
            localStorage.removeItem('show_video_bank');
        }
    }
    showDetailedMosaic(){
        return localStorage.getItem('show_detailed_mosaic') === 'true';
    }
    toggleShowDetailedMosaic(event){
        if (event.checked){
            localStorage.setItem('show_detailed_mosaic', 'true');
        }else{
            localStorage.removeItem('show_detailed_mosaic');
        }
    }
    mosaicDelay(){
        return localStorage.getItem('dont_reload_mosaic') === 'true';
    }
    toggleMosaicDelay(event){
        if (event.checked){
            localStorage.setItem('dont_reload_mosaic', 'true');
        }else{
            localStorage.removeItem('dont_reload_mosaic');
        }
    }
    saveProperties() {
        const params: URLSearchParams = new URLSearchParams();
        this.cameras.forEach((conf: Property[], key: string) => {
            if (null !== conf) {
                conf.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });
        this.webCameras.forEach((conf: Property[], key: string) => {
            if (null !== conf) {
                conf.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });
        this.webMicrophones.forEach((conf: Property[], key: string) => {
            if (null !== conf) {
                conf.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });
        this.microphones.forEach((conf: Property[], key: string) => {
            if (null !== conf) {
                conf.forEach(prop => {
                    params.set(prop.name, prop.value);
                });
            }
        });
        this.general.forEach(conf => {
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
        this.advanced.forEach(conf => {
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
        this.http.post<any>('/api/parameters/', 'action=Parameter&verb=save&' + params,
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
    setStartProcess(e) {
        this.http.post<any>('/api/services/startstop/', 'verb=' + (e.checked ? 'resume' : 'pause'),
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
    setRecordDevices(prm: string, e) {
        // console.log(prm);
        this.http.post<any>('/api/recorder/controls/', 'verb=' + ((e.checked ? 'resume' : 'pause') + ('&prm=' + prm)),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).subscribe(
                (res) => {
                    this.errorMsg = 'Success';

                },
                (err) => {
                    console.log(err);
                    this.errorMsg = err.message;
                });
    }
    ngOnInit() {
        const self = this;
        this.http.get('/api/recorder/controls/'+'?'+Math.random())
            .subscribe(
                data => {
                    const t = data as { control: { name: string, state: boolean }[] };


                            //self.controls.autoprocess = t['autoprocess'];
                      
                            self.controls.autorecordAudio = t['autorecordAudio'];
                       
                            self.controls.autorecordVideo = t['autorecordVideo'];
                        

                    self.isLoadingControls = false;
                },
                err => this.logError(err),
            );
        this.http.get('api/services/status/'+'?'+Math.random())
        .subscribe(
            data => {
                const t = data as { control: { name: string, state: boolean }[] };


                        self.controls.autoprocess = t['autoprocess'];
                    
                        // self.controls.autorecordAudio = t['autorecordAudio'];
                        // self.controls.autorecordVideo = t['autorecordVideo'];
                    

                self.isLoadingControls = false;
            },
            err => this.logError(err),
        );            
        this.http.get('/api/parameters/'+'?'+Math.random())
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

                    self.isLoadingConf = false;
                },
                err => this.logError(err),
            );
    }

    logError(error: object): void {
        console.log(error);
    }
}
