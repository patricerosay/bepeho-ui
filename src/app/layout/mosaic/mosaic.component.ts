import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { Camera } from './camera-interface';

export interface DialogData {
  animal: string;
  name: string;
}

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
  ) {}

  onSubmit(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit {
  constructor(
    public http: HttpClient,
    // public activeModal: NgbActiveModal,
    // private _ngZone: NgZone,
    public dialog: MatDialog
  ) {}

  private url = '/recorder/cams';
  isLoading = true;
  cameras: Array<Camera> = new Array<Camera>();
  mosaic: Array<Camera> = new Array<Camera>();
  camera: Camera;
  stream: string;
  microphone = 'CAM0';
  withData: boolean;
  errorMsg: string;

  ngOnInit() {
    const self = this;
    // const self.cameras = new Camera[];
    this.http.get(this.url).subscribe(data => {
      // self.cameras
      const tempCams = data as Camera[];
      tempCams.forEach(function(cam) {
        if ('CAM' === cam.type) {
          self.cameras.push(cam);
          if (cam.camPreviewUrl && cam.enabled) {
            self.mosaic.push(cam);
          }
        }
      });
      self.cameras.reverse();
      self.mosaic.reverse();
      self.isLoading = false;
    });
  }
  private postAction(body: string) {
    const prms = [this.camera.id, 'MIC0'];
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
  onMicChanged(e): void {
    this.microphone = e.checked ? 'MIC0' : null;
  }
  onDataChanged(e): void {
    this.postAction('action=data&verb=' + (e.checked ? 'start' : 'stop'));
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
