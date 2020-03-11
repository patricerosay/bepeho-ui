import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    animations: [routerTransition()]
})

export class NetworkComponent implements OnInit {
    public error: string = null;

    isLoading = true;
    networkTestStarted = false;
    apiRTC: any;
    ua = null;
    errorMsg = '';
    upload = 0;
    download = 0;
    latency = 0;

    cloudUrl = 'https://cloud.apizee.com';
    apikey = 'apzkey:a56f6c0e185ada4f0b1abbe563c8a37a';
    constructor( private translate: TranslateService,
        private scriptService: ScriptService) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
            const self = this;
            scriptService
            .load('apizee')
            .then(data => {
              self.apiRTC = window['apiRTC'];

              self.apiRTC.setLogLevel(0);
              this.ua = new this.apiRTC.UserAgent({
                uri: this.apikey
              });


              self.testNetwork();
              // self.joinConference(self.conferenceRoom);
              self.isLoading = false;

            })
            .catch(error => (self.errorMsg = error));
    }

    testNetwork(): void {
        const self = this;
        self.networkTestStarted = true;

        self.ua.fetchNetworkInformation().then(function(netinfo) {
          console.log(netinfo);
            self.upload = netinfo.upload.kbps;
            self.download = netinfo.download.kbps;
            self.latency = netinfo.httpPing;
            self.networkTestStarted = false;
            localStorage.setItem('upload-kbps', self.upload.toString() );
            localStorage.setItem('download-kbps', self.download.toString() );
        })
        .catch(function(err) {
          self.networkTestStarted = false;
          console.error('fetchNetworkInformationNew error', err);
          self.errorMsg = err.label;
        });
      }

    ngOnInit() {
    this.isLoading = false;
    const self = this;

    }
    logError(error: object): void {
        this.error = 'error';
    }
}
