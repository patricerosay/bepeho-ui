import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Camera } from './camera-interface';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  template: `
<h1 mat-dialog-title>Hi toto</h1>
<div mat-dialog-content>
  <p>What's your favorite animal?</p>
  <mat-form-field>
    <input matInput >
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button (click)="onNoClick()" cdkFocusInitial>Ok</button>
</div>
    `
})

export class CameraPropertiesModal {

  constructor(
    public dialogRef: MatDialogRef<CameraPropertiesModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
    selector: 'app-mosaic',
    templateUrl: './mosaic.component.html',
    styleUrls: ['./mosaic.component.scss']
})

export class MosaicComponent implements OnInit {
  constructor(public http: HttpClient,
    // public activeModal: NgbActiveModal,
    // private _ngZone: NgZone,
    public dialog: MatDialog)
    {}

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

    openDialog(): void {
    const dialogRef = this.dialog.open(CameraPropertiesModal, {
      width: '250px',
      data: {name: 'tot', animal: 'tit'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
}
