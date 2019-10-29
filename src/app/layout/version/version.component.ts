import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Version } from './version-interface';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// import { Versions } from './version-mocks';
// import { loadInternal } from '@angular/core/src/render3/util';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
  animations: [routerTransition()],

})

export class VersionComponent implements OnInit {

  versions: Version[];
  product: string;
  environment: string;
  isLoading = true;
  constructor(public http: HttpClient,
    private translate: TranslateService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
 }
  onUpdate() {
    this.http.post('/recorder/versions&verb=update', '');
  }

  ngOnInit() {
    const self = this;
    this.http.get('/recorder/versions')
    // .map((res: Response) => res.json())
    .subscribe(
        data => {
            // self.versions = data as Version[];
            // let body =  data['versions'] as Version[];
            self.product = data['application'];
            self.environment = data['environmentlibs'];
            //self.versions = data['versions'] as Version[];
            //self.versions.sort((a, b) => a.name.localeCompare(b.name));

            self.isLoading = false;
        },
    );
  }

}
