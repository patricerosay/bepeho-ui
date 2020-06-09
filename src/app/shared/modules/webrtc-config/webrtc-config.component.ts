import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ScriptService } from '../../services/scripts/script.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-bandwidth',
  templateUrl: './webrtc-config.component.html',
  styleUrls: ['./webrtc-config.component.scss'  ]
})



export class WebrtcConfigComponent implements OnInit {
  public error: string = null;

  isLoading = true;
  audioInputs: any[];
  audioOutputs: any[];

  constructor( private translate: TranslateService,
    private scriptService: ScriptService) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
        const self = this;
}
   @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    console.log('audio inputs ', this.audioInputs);
    console.log('audio outputs ', this.audioOutputs);

  }
  getCookieInfo(key: string, def: string): string {
    const val = localStorage.getItem(key);
    return (val) ? val : def;
  }
  onSelectAudioInput(mic) {
    localStorage.setItem('selectedAudioInput', mic.id);
    console.log('select ', mic);
  }
  onSelectAudioOutput(audioOut) {
    localStorage.setItem('selectedAudioOutput', audioOut.id);

    console.log('select ', audioOut);
  }

}


