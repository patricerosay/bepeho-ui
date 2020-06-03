import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-adressbook',
  templateUrl: './adressbook.component.html',
  styleUrls: ['./adressbook.component.scss'  ]
})



export class AdressbookComponent implements OnInit {
  public error: string = null;
  public users: any = {};
 public isLoading= true;
  constructor( private translate: TranslateService ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        
}
   @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.users = JSON.parse(localStorage.getItem('users'));
    this.isLoading = false;
  }


}


