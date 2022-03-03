import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  MatDialog
} from '@angular/material/dialog';

import { Camera } from '../../shared/interfaces/camera-interface';
import { Cameras } from '../../shared/services/parameters/cameras';
import { Microphone } from '../../shared/interfaces/microphone-interface';
import { Microphones } from '../../shared/services/parameters/microphones';


export interface IInstrument {
  speed: string;
  heading: string;
  tws: string;
  twd: string;
  time: string;
  blo: string;
  bla: string;
}
export interface IInstrument2 {
  heave_motion: string;

  accx: string;
  accy: string;
  accz: string;
  gyrox: string;
  gyroy: string;
  gyroz: string;
  heel: string;
  trim: string;
}
const ELEMENT_DATA: IInstrument[] = [
  { heading: 'n/a', speed: 'n/a', tws: 'n/a', twd: 'n/a', time: 'n/a', bla: 'n/a', blo: 'n/a' }
];
const ELEMENT_DATA2: IInstrument2[] = [
  { accx: 'n/a', accy: 'n/a', accz: 'n/a', gyrox: 'n/a', gyroy: 'n/a', gyroz: 'n/a', heel: 'n/a', trim: 'n/a', heave_motion: 'n/a' }
];


@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit, OnDestroy {
  worker: any;
  public cameras: Cameras = null;
  public microphones: Microphones = null;
  public selectedCamera=0;
  public group=0;
  isFullScreen=false;
  getlangage(): string {
    const langage = localStorage.getItem("langage");
    if (!langage) return this.translate.getBrowserLang();
    return langage;
  }
  constructor(
    public http: HttpClient,
    private translate: TranslateService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.getlangage();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    this.cameras = new Cameras(http);
    this.microphones = new Microphones(http);
  }

  displayedColumns1: string[] = ['heading', 'speed', 'time', 'blo', 'bla'];
  displayedColumns2: string[] = ['accx', 'accy', 'accz', 'heel', 'trim'];

  dataSource1: IInstrument[] = ELEMENT_DATA;
  dataSource2: IInstrument2[] = ELEMENT_DATA2;

  isLoading = true;
  mosaic: Array<Camera> = new Array<Camera>();
  cams: Array<Camera> = new Array<Camera>();
  mics: Array<Microphone> = new Array<Microphone>();
  camera: Camera;
  stream: string;
  microphone = null;
  withData: boolean;
  errorMsg: string;

  onDisplayInstrument(e): void {
    this.stopInstrumentWorker();
    if (e.checked) {
      this.startInstrumentWorker();
    }
  }
  getInstruments() {
    const self = this;
    self.http.get('/recorder/data?' + Math.random()).subscribe(data => {
      const instruments = data as { id: string; value: string }[];
      if (null !== instruments) {
        instruments.forEach(function (ins) {
          if ('bgs_d' === ins.id) {
            self.dataSource1[0].speed = ins.value;
          } else if ('bgt_d' === ins.id) {
            self.dataSource1[0].heading = ins.value;
          } else if ('twa_d' === ins.id) {
            self.dataSource1[0].twd = ins.value;
          } else if ('tws_d' === ins.id) {
            self.dataSource1[0].tws = ins.value;
          } else if ('gpsTime' === ins.id) {
            const n = Math.round(parseInt(ins.value, 10));
            // 164023.00
            const h = Math.floor(n / 10000);
            const m = Math.floor((n - (h * 10000)) / 100);
            const s = n - ((h * 10000) + (m * 100));
            self.dataSource1[0].time = h + ':' + m + ':' + s;
          } else if ('blo' === ins.id) {
            self.dataSource1[0].blo = ins.value;
          } else if ('bla' === ins.id) {
            self.dataSource1[0].bla = ins.value;
          }
          else if ('xac_d' === ins.id) {
            self.dataSource2[0].accx = ins.value;
          }
          else if ('yac_d' === ins.id) {
            self.dataSource2[0].accy = ins.value;
          }
          else if ('zac_d' === ins.id) {
            self.dataSource2[0].accz = ins.value;
          }
          else if ('hee_d' === ins.id) {
            self.dataSource2[0].heel = ins.value;
          } else if ('trm_d' === ins.id) {
            self.dataSource2[0].trim = ins.value;
          } else if ('hmn_d' === ins.id) {
            self.dataSource2[0].heave_motion = ins.value;
          }

        });
      } else {
        self.dataSource1[0].speed = 'err';
        self.dataSource1[0].heading = 'err';
        self.dataSource1[0].twd = 'err';
        self.dataSource1[0].tws = 'err';
        self.dataSource1[0].time = 'err';
        self.dataSource1[0].blo = 'err';
        self.dataSource2[0].accx = 'err';
        self.dataSource2[0].accy = 'err';
        self.dataSource2[0].accz = 'err';


      }
    },
      () => {
        self.dataSource1[0].speed = 'err';
        self.dataSource1[0].heading = 'err';
        self.dataSource1[0].twd = 'err';
        self.dataSource1[0].tws = 'err';
        self.dataSource1[0].time = 'err';
        self.dataSource1[0].blo = 'err';
        self.dataSource2[0].accx = 'err';
        self.dataSource2[0].accy = 'err';
        self.dataSource2[0].accz = 'err';
      });
  }
  stopInstrumentWorker(): void {
    if (null !== this.worker) {
      clearInterval(this.worker);
      this.worker = null;
      this.dataSource1[0] = { heading: 'n/a', speed: 'n/a', tws: 'n/a', twd: 'n/a', time: 'n/a', bla: 'n/a', blo: 'n/a' };
      this.dataSource2[0] = { accx: 'n/a', accy: 'n/a', accz: 'n/a', gyrox: 'n/a', gyroy: 'n/a', gyroz: 'n/a', heel: 'n/a', trim: 'n/a', heave_motion: 'n/a' };

    }
  }
  startInstrumentWorker(): void {
    this.getInstruments();
    this.worker = setInterval(() => {
      this.getInstruments();
    }, 2500);


  }
  ngOnDestroy() {
    console.log('ondestroy');
    this.stopInstrumentWorker();
  }
  ngOnInit() {

    const self = this;
    //this.startInstrumentWorker();

    self.cameras.getCameras().then(mos => {

      mos.forEach(element => {
        if ('nomos' !== element.camPreviewUrl )
          self.mosaic.push(element);
      });
      self.cams = mos;
      self.microphones.getMicrophones().then(mic => {
        self.mics = mic;
        console.log(self.mics);
        self.isLoading = false;
      });
    }).catch(e => {
      console.log('ngOnInit', e.errorMsg);
    })

  }

  onClickVideo(index)
  {
     this.group=1;
     this.selectedCamera=index;

  }
  onFullPage(index)
  {
    if(this.isFullScreen){
      document.exitFullscreen();
      this.isFullScreen=false;
    }else
    var elem = document.getElementById(index);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.isFullScreen = true;
    }
  }
  getPreviewUrl(cam: Camera): string {
    if (cam) {
      return '/' + cam.id;
    } else {
      return undefined;
    }
  }


}

