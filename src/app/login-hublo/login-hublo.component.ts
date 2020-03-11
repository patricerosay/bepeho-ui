import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
import { NgForm } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, } from '@angular/common/http';
import { ScriptService } from '../shared/services/scripts/script.service';
@Component({
    selector: 'app-login',
    templateUrl: './login-hublo.component.html',
    styleUrls: ['./login-hublo.component.scss'],
    animations: [routerTransition()]
})
export class LoginHubloComponent implements OnInit {
    private regForm: FormGroup;
    // private name = '';
    isLogginFailed = false;
    apiRTC: any;
    ua: any;
    isLoading = true;
    errorMsg: string;
    connectedSession: any;
    returnUrl: string;
    isRegistering = false;
    constructor(
        private translate: TranslateService,
        public router: Router,
        private route: ActivatedRoute,
        public http: HttpClient,
        private scriptService: ScriptService
    ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
        const self = this;

        scriptService.load('apizee').then(data => {
            self.apiRTC = window['apiRTC'];

            self.apiRTC.setLogLevel(0);

            self.isLoading = false;

        }).catch(error => self.errorMsg = error);

    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onCancel() {
        this.router.navigateByUrl('/dashboard');
    }

    // onLoggedin(f: NgForm) {
    //     const self = this;
    //     self.isLogginFailed = false;
    //     console.log('register');

    //     if (this.ua) {
    //         delete this.ua;
    //     }
    //     const apikey='apizee:' + f.value.name;
    //     // LOGIN
    //     this.ua = new this.apiRTC.UserAgent({
    //         uri: apikey
    //     });

    //     if (!this.ua) {
    //         console.log('UA is not created');
    //         return;
    //     }



    //     const registerInformation = {
    //         cloudFetchRetries: 3,
    //         cloudFetchRetryDelay: 2000,
    //         password: f.value.pass
    //     };
    //     // PASSWORD


    //     this.ua.register(registerInformation).then(function (session) {
    //         // Save session
    //         self.connectedSession = session;
    //         //  localStorage.setItem('session', JSON.stringify(self.ua));
    //         localStorage.setItem('isLoggedin', 'true');
    //         localStorage.setItem('apikey', apikey);
    //         localStorage.setItem('apipass', f.value.pass);
    //         localStorage.setItem('id', self.connectedSession.id);
    //         localStorage.setItem('token', 'apzkey:' + self.connectedSession.token);
    //         localStorage.setItem('username', self.connectedSession.userData.username);
    //         localStorage.setItem('nickname', self.connectedSession.userData.nickname);

    //         self.router.navigateByUrl(self.returnUrl);
    //         // Display user number
    //         console.log(self.connectedSession);
    //     }).catch(function (error) {
    //         // error
    //         self.isLogginFailed = true;
    //         console.error('User agent registration failed', error);
    //     });
    // }
    onLoggedin(f: NgForm) {

        const self = this;
        self.isLogginFailed = false;
        self.isRegistering = true;
        console.log('register');

        if (this.ua) {
            delete this.ua;
        }
        const apikey = 'apizee:' + f.value.name;
        // LOGIN
        this.ua = new this.apiRTC.UserAgent({
            uri: apikey
        });

        if (!this.ua) {
            console.log('UA is not created');
            return;
        }



        const registerInformation = {
            cloudFetchRetries: 3,
            cloudFetchRetryDelay: 2000,
            password: f.value.pass
        };
        // PASSWORD


        this.ua.register(registerInformation).then(function (session) {
            // Save session
            self.connectedSession = session;
            //  localStorage.setItem('session', JSON.stringify(self.ua));

            localStorage.setItem('apikey', apikey);
            localStorage.setItem('apipass', f.value.pass);
            localStorage.setItem('id', self.connectedSession.id);
            localStorage.setItem('key', self.connectedSession.token);
            localStorage.setItem('token', 'apzkey:' + self.connectedSession.token);
            localStorage.setItem('username', self.connectedSession.userData.username);
            localStorage.setItem('nickname', self.connectedSession.userData.nickname);


            const header = {
              accept: 'application/json',
              Authorization: 'Bearer ' + self.connectedSession.token
            };

            self.apiRTC.CloudApi.get('/api/getEnterpriseInfos', {}, header).then(response => {
                localStorage.setItem('enterpriseId', response.enterpriseId  );
                localStorage.setItem('enterpriseKey', response.enterpriseKey  );


  
            }).catch(error => {console.error(error); self.isRegistering = false; });

            localStorage.setItem('isLoggedinHublo', 'true');
            self.isRegistering = false;
            self.router.navigateByUrl(self.returnUrl);
            // Display user number
            // self.router.navigateByUrl(self.returnUrl);
            console.log(self.connectedSession);
        }).catch(function (error) {
            // error
            self.isLogginFailed = true;
            self.isRegistering = false;
            console.error('User agent registration failed', error);
        });
    }
}
