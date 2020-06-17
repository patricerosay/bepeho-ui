import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ScriptService } from '../../services/scripts/script.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-bandwidth',
  templateUrl: './webrtc-config.component.html',
  styleUrls: ['./webrtc-config.component.scss']
})



export class WebrtcConfigComponent implements OnInit {
  public error: string = null;

  isLoading = true;
  audioInputs: any[];
  audioOutputs: any[];
  public cams: any[];
  constraints = [
    {
      label: 'default: Very low bandwidth',
      uploadkbps: '80',
      downloadkbps: '100',
      localCameraCaptureFps: '5',
      constraints: {
        audio: true,
        video: {
          frameRate: { min: 5, max: 5, ideal: 5 },
          width: { min: '160', max: '160', ideal: '160' },
          height: { min: '120', max: '120', ideal: '120' }
        }
      }
    },
    {
      label: 'Low Bandwidth configuration',
      uploadkbps: '150',
      downloadkbps: '300',
      localCameraCaptureFps: '10',
      constraints: {
        audio: true,
        video: {
          frameRate: { min: 10, max: 10, ideal: 10 },
          width: { min: '320', max: '320', ideal: '320' },
          height: { min: '240', max: '240', ideal: '240' }
        }
      }
    },
    {
      label: 'Fair Bandwidth configuration',
      uploadkbps: '300',
      downloadkbps: '600',
      localCameraCaptureFps: '20',
      constraints: {
        audio: true,
        video: {
          frameRate: { min: 20, max: 20, ideal: 20 },
          width: { min: '640', max: '640', ideal: '640' },
          height: { min: '480', max: '480', ideal: '480' }
        }
      }
    },
    {
      label: 'Good',
      uploadkbps: '300',
      downloadkbps: '600',
      localCameraCaptureFps: '25',
      constraints: {
        audio: true,
        video: {
          frameRate: { min: 25, max: 25, ideal: 25 },
          width: { min: '640', max: '640', ideal: '640' },
          height: { min: '480', max: '480', ideal: '480' }
        }
      }
    },
    {
      label: 'Very Good',
      uploadkbps: '300',
      downloadkbps: '600',
      localCameraCaptureFps: '25',
      constraints: {
        audio: true,
        video: {
          frameRate: { min: 25, max: 25, ideal: 25 },
          width: { min: '960', max: '960', ideal: '960' },
          height: { min: '720', max: '720', ideal: '720' }
        }
      }
    }
  ];

  constructor(private translate: TranslateService,
    private scriptService: ScriptService) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    const self = this;
  }
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  ngOnInit() {
    console.log('audio inputs ', this.audioInputs);
    console.log('audio outputs ', this.audioOutputs);

  }
  getCookieInfo(key: string, def: string): string {
    const val = localStorage.getItem(key);
    return (val) ? val : def;
  }
  isSelectedConstraint(cons: any): boolean {

    const val: any = localStorage.getItem('selectedConstraintSet');
    if (val) {
      const o: any = JSON.parse(val);
      return  o.label === cons.label;
    } else {
      return 'default: Very low bandwidth' === cons.label;
    }
  }
  onSelectAudioInput(mic) {
    localStorage.setItem('selectedAudioInput', mic.id);
    console.log('select ', mic);
  }
  onSelectAudioOutput(audioOut) {
    localStorage.setItem('selectedAudioOutput', audioOut.id);

    console.log('select ', audioOut);
  }
  onConstraint(cons) {
    localStorage.setItem('upload-kbps', cons.uploadkbps);
    localStorage.setItem('download-kbps', cons.downloadkbps);

    localStorage.setItem('selectedConstraintSet', JSON.stringify(cons));
  }
  flipFlop(key) {
    const v = this.getCookieInfo(key, 'false');
    if ('true' === v) {
      localStorage.setItem(key, 'false');
    } else {
      localStorage.setItem(key, 'true');
    }
  }
  showCamera(id) {
    const b = localStorage.getItem(id);
    if (! b) {
      return true;
    } else {
      return 'true' === b;
    }

  }
}


