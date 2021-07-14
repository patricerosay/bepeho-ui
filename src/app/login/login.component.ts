import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
import {NgForm} from '@angular/forms';
import { HttpClient, } from '@angular/common/http';
import { Configuration, Property, Controls } from '../shared/interfaces/configuration-interface';

import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    private regForm: FormGroup;
    private name = '';
    loginFailed = false;
    isLoadingConf = true;
    password = 'bepeho';
    constructor(
        public http: HttpClient,
        private translate: TranslateService,
        public router: Router
        ) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }

    ngOnInit() {
        const self = this;
        this.http.get('/recorder/parameters'+'?'+Math.random())
            .subscribe(
                data => {
                    const configurations = data as Configuration[];
                    configurations.forEach(conf => {
                        
                        if ('HTTP Server' === conf.displayGroup) {
                                conf.props.general.forEach(prop=>{
                                if ( prop.name === 'ADMIN_PASSWORD') {
                                    self.password= prop.value
                                }
                            })
                        }
                    });

                    self.isLoadingConf = false;
                },
                err => this.logError(err),
            );
    }

    onLoggedin(f: NgForm ) {
        if (f.value.name  === 'mediaman' && f.value.pass === this.password) {
            sessionStorage.setItem('isLoggedin', 'true');
            this.router.navigateByUrl('/');
        } else {
            this.loginFailed = true;
        }
    }
    logError(error: object): void {
        console.log(error);
    }
}
