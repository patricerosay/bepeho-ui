import { Component, OnInit , Inject} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-adressbook',
  templateUrl: './adressbook.component.html',
  styleUrls: ['./adressbook.component.scss'  ]
})



export class AdressbookComponent implements OnInit {
  public error: string = null;
  public users: any = {};
  public currentId: string;
//  public selectedUserID: number;
 constructor(
  public dialogRef: MatDialogRef<AdressbookComponent>,
  @Inject(MAT_DIALOG_DATA) public calleeID: number) {}
   @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.currentId = localStorage.getItem('id');
    this.users = JSON.parse(localStorage.getItem('users'));
  }
  onChange(e ) {
    this.calleeID = e.option.value;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


