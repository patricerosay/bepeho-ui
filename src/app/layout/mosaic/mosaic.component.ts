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

// @Component({
//   template: `
// <h1 mat-dialog-title>Hi toto</h1>
// <div mat-dialog-content>
//   <p>What's your favorite animal? {{data.name }}</p>
//   <mat-form-field>
//     <input matInput >
//   </mat-form-field>
// </div>
// <div mat-dialog-actions>
//   <button mat-button (click)="onNoClick()">No Thanks</button>
//   <button mat-button (click)="onNoClick()" cdkFocusInitial>Ok</button>
// </div>
//     `
// })
@Component({
  template: `
  <div class="container">
    <h1>Change Parameters</h1>
    <form (ngSubmit)="onSubmit()" #heroForm="ngForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name"
               required
               [(ngModel)]="data.name" name="name"
               #name="ngModel">
        <div [hidden]="name.valid || name.pristine"
             class="alert alert-danger">
          Name is required
        </div>

        <label for="url">Preview URL</label>
        <input type="text" class="form-control" id="url"
               required
               [(ngModel)]="data.camPreviewUrl" name="url"
               #name="ngModel">
        <div [hidden]="name.valid || name.pristine"
             class="alert alert-danger">
          URL is required
        </div>

        <label for="address">Recording Address </label>
        <input type="text" class="form-control" id="address"
               required
               [(ngModel)]="data.address" name="address"
               #name="ngModel">
        <div [hidden]="name.valid || name.pristine"
             class="alert alert-danger">
          Address is required
        </div>

      <mat-slide-toggle
            class="example-margin"
            color="accent"
            [(ngModel)]="data.shouldRecord" name="shouldRecord"
            [checked]="data.shouldRecord"
            [disabled]="false">
          Should Record
        </mat-slide-toggle>
        <mat-slide-toggle
            class="example-margin"
            color="accent"
            [(ngModel)]="data.active" name="active"
            [checked]="data.active"
            [disabled]="false">
          Active
        </mat-slide-toggle>

        <mat-slide-toggle
            class="example-margin"
            color="accent"
            [(ngModel)]="data.enabled" name="enabled"
            [checked]="data.enabled"
            [disabled]="false">
          Enabled
        </mat-slide-toggle>
      </div>
      <button type="cancel" class="btn btn-success"> Cancel</button>

      <button type="submit" class="btn btn-success" [disabled]="!heroForm.form.valid"> Save</button>
    </form>
  </div>
    `
})
export class CameraPropertiesModal {

  constructor(
    public dialogRef: MatDialogRef<CameraPropertiesModal>,
    @Inject(MAT_DIALOG_DATA) public data: Camera) {}

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
