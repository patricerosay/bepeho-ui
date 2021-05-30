import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { Camera } from '../../shared/interfaces/camera-interface';
import { Cameras } from '../../shared/services/parameters/cameras';
import { Microphone } from '../../shared/interfaces/microphone-interface';
import { Microphones } from '../../shared/services/parameters/microphones';
import { random } from 'core-js/core/number';
export interface IInstrument {
  speed: string;
  heading: string;
  tws: string;
  twd: string;
  time: string;
  blo: string;
  bla: string;
}

const ELEMENT_DATA: IInstrument[] = [
  { heading: 'n/a', speed: 'n/a', tws: 'n/a', twd: 'n/a', time: 'n/a', bla: 'n/a', blo: 'n/a' }
];

@Component({
  template: `
    <div class="container">
      <h1>View Parameters</h1>
      <form (ngSubmit)="onSubmit()" #heroForm="ngForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            [disabled]="true"
            type="text"
            class="form-control"
            id="name"
            required
            [(ngModel)]="data.name"
            name="name"
            #name="ngModel"
          />
          <div
            [hidden]="name.valid || name.pristine"
            class="alert alert-danger"
          >
            Name is required
          </div>

          <label for="url">Preview URL</label>
          <input
            [disabled]="true"
            type="text"
            class="form-control"
            id="url"
            required
            [(ngModel)]="data.camPreviewUrl"
            name="url"
            #name="ngModel"
          />
          <div
            [hidden]="name.valid || name.pristine"
            class="alert alert-danger"
          >
            URL is required
          </div>

          <label for="address">Recording Address </label>
          <input
            [disabled]="true"
            type="text"
            class="form-control"
            id="address"
            required
            [(ngModel)]="data.address"
            name="address"
            #name="ngModel"
          />
          <div
            [hidden]="name.valid || name.pristine"
            class="alert alert-danger"
          >
            Address is required
          </div>

          <mat-slide-toggle
            class="example-margin"
            color="accent"
            [(ngModel)]="data.shouldRecord"
            name="shouldRecord"
            [checked]="data.shouldRecord"
            [disabled]="true"
          >
            Record
          </mat-slide-toggle>
          <br />
          <mat-slide-toggle
            class="example-margin"
            color="accent"
            [(ngModel)]="data.enabled"
            name="enabled"
            [checked]="data.enabled"
            [disabled]="true"
          >
            Mosaic
          </mat-slide-toggle>
        </div>
        <button type="cancel" class="btn btn-success">Close</button>

        <!-- <button type="submit" class="btn btn-success" [disabled]="!heroForm.form.valid"> Save</button>-->
      </form>
    </div>
  `
})
export class CameraPropertiesModal {
  constructor(
    public dialogRef: MatDialogRef<CameraPropertiesModal>,
    @Inject(MAT_DIALOG_DATA) public data: Camera
  ) { }

  onSubmit(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit, OnDestroy {
  worker: any;
  public cameras: Cameras = null;
  public microphones: Microphones = null;
  getlangage(): string {    
    const langage = localStorage.getItem("langage");
    if (! langage) return this.translate.getBrowserLang();
    return langage;
}
  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private translate: TranslateService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.getlangage();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    this.cameras = new Cameras(http);
    this.microphones = new Microphones(http);
  }

  displayedColumns: string[] = ['heading', 'speed', 'time', 'blo', 'bla'];
  dataSource: IInstrument[] = ELEMENT_DATA;

  isLoading = true;
  mosaic: Array<Camera> = new Array<Camera>();
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
    self.http.get('/recorder/data').subscribe(data => {
      const instruments = data as { id: string; value: string }[];
      if (null !== instruments) {
        instruments.forEach(function (ins) {
          if ('bgs_d' === ins.id) {
            self.dataSource[0].speed = ins.value;
          } else if ('bgt_d' === ins.id) {
            self.dataSource[0].heading = ins.value;
          } else if ('twa_d' === ins.id) {
            self.dataSource[0].twd = ins.value;
          } else if ('tws_d' === ins.id) {
            self.dataSource[0].tws = ins.value;
          } else if ('gpsTime' === ins.id) {
            const n = Math.round(parseInt(ins.value, 10));
            // 164023.00
            const h = Math.floor(n / 10000);
            const m = Math.floor((n - (h * 10000)) / 100);
            const s = n - ((h * 10000) + (m * 100));
            self.dataSource[0].time = h + ':' + m + ':' + s;
          } else if ('blo' === ins.id) {
            self.dataSource[0].blo = ins.value;
          } else if ('bla' === ins.id) {
            self.dataSource[0].bla = ins.value;
          }
        });
      } else {
        self.dataSource[0].speed = 'err';
        self.dataSource[0].heading = 'err';
        self.dataSource[0].twd = 'err';
        self.dataSource[0].tws = 'err';
        self.dataSource[0].time = 'err';
        self.dataSource[0].blo = 'err';
      }
    },
      () => {
        self.dataSource[0].speed = 'err';
        self.dataSource[0].heading = 'err';
        self.dataSource[0].twd = 'err';
        self.dataSource[0].tws = 'err';
        self.dataSource[0].time = 'err';
        self.dataSource[0].blo = 'err';

      });
  }
  stopInstrumentWorker(): void {
    if (null !== this.worker) {
      clearInterval(this.worker);
      this.worker = null;
      this.dataSource[0] = { heading: 'n/a', speed: 'n/a', tws: 'n/a', twd: 'n/a', time: 'n/a', bla: 'n/a', blo: 'n/a' };
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
      self.mosaic = mos;
      self.microphones.getMicrophones().then(mic => {
        self.mics = mic;
        console.log(self.mics);
        self.isLoading = false;
      });
    });

  }
  private postAction(body: string) {
    this.http
      .post<any>('/recorder', body, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      .subscribe(
        res => {
          console.log(res);
          this.errorMsg = 'Success';
        },
        err => {
          console.log(err);
          this.errorMsg = err.message;
        }
      );
  }
  onMicChanged(e, id): void {
    this.microphone = e.checked ? id : null;
  }
  onDataChanged(e): void {
    this.postAction('action=data&verb=' + (e.checked ? 'start' : 'stop'));
  }
  getPreviewUrl(cam: Camera): string {
    if (cam) {
      return '/' + cam.id ;
    } else {
      return undefined;
    }
  }
  onStream(stream: string) {
    this.stream = stream;
    if ('LIVERECORD' !== this.stream) {
      const prms = [this.camera.id, this.microphone];
      this.http
        .post<any>(
          '/recorder',
          'action=CamButtons&verb=merge&' + 'stream=' + stream + '&prm=' + prms,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .subscribe(
          res => {
            console.log(res);
            this.errorMsg = 'Success';
          },
          err => {
            console.log(err);
            this.errorMsg = err.message;
          }
        );
    } else {
      const prms = [this.camera.id, this.microphone];
      this.http
        .post<any>(
          '/recorder',
          'action=RecordButtons&verb=startRec&prm=' + prms,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .subscribe(
          res => {
            console.log(res);
            this.errorMsg = 'Success';
          },
          err => {
            console.log(err);
            this.errorMsg = err.message;
          }
        );
    }
  }

  onStopStream(): void {
    if ('LIVERECORD' !== this.stream) {
      this.postAction('action=CamButtons&verb=stop');
    } else {
      this.postAction('action=RecordButtons&verb=stop');
    }
    this.stream = null;
  }

  openDialog(cam: Camera): void {
    const dialogRef = this.dialog.open(CameraPropertiesModal, {
      width: '100%',
      data: cam
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
}
