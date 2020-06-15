import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ScriptService } from '../../services/scripts/script.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-bandwidth',
  templateUrl: './bandwidth.component.html',
  styleUrls: ['./bandwidth.component.scss'  ]
})



export class BandwidthComponent implements OnInit {
  public error: string = null;

  isLoading = true;
  networkTestStarted = false;
  apiRTC: any;
  ua = null;
  errorMsg = '';
  upload = 0;
  download = 0;
  latency = 0;
  fps = 0;
  upQoSs = [
    { label: 'Low', kbps: 100 },
    { label: 'Good', kbps: 700 },
    { label: 'Very good', kbps: 2000 }
  ];
  constraints: any;
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
   @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {

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
        self.constraints = {video: {width: {exact: 320}, height: {exact: 240}}, audio : {}};

        if ( self.upload <= 100 ) {
          self.fps = 5;

        } else if (self.upload <= 200) {
          self.fps = 10;
        } else if (self.upload <= 400) {
          self.fps = 15;
          self.constraints = {video: {width: {exact: 640}, height: {exact: 480}}, audio : {}};

        } else if (self.upload <= 600) {
          self.constraints = {video: {width: {exact: 640}, height: {exact: 480}}, audio : {}};
          self.fps = 20;
        } else if (self.upload <= 800) {
          self.constraints = {video: {width: {exact: 1280}, height: {exact: 720}}, audio : {}};

          self.fps = 25;
        } else {
          self.constraints = {video: {width: {exact: 1920}, height: {exact: 1080}}, audio : {}};

          self.fps = 30;
        }
        localStorage.setItem('localCameraCaptureFps', self.fps.toString() );
        localStorage.setItem('upload-kbps', self.upload.toString() );
        localStorage.setItem('download-kbps', self.download.toString() );
        localStorage.setItem('constraints', JSON.stringify(self.constraints ));
    })
    .catch(function(err) {
      self.networkTestStarted = false;
      console.error('fetchNetworkInformationNew error', err);
      self.errorMsg = err;
    });
  }

}


