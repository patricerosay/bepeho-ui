import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITask } from '../../../shared/interfaces/task-interface';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;

    getlangage(): string {    
        const langage = localStorage.getItem("langage");
        if (! langage) return this.translate.getBrowserLang();
        return langage;
    }

    constructor(private translate: TranslateService, public router: Router, public http: HttpClient) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.getlangage();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }


    private urlProcess = '/api/services/states/';
    private urlStatus = '/api/services/status/';
    isLoading = true;
    tasks: ITask[];
    taskInError = 0;
    status = 0;
    getCookieInfo(key: string): string {
        return localStorage.getItem(key);
      }
    ngOnInit()  {
        this.pushRightClass = 'push-right';
        const self = this;
        this.http.get(this.urlStatus+'?'+Math.random())
        .subscribe(
            data => {
                self.status = data['RecapProgressStatus'] as number;
            },
        );
        this.http.get(this.urlProcess+'?'+Math.random())
            .subscribe(
                data => {
                    self.tasks = data['ProgressStatus'] as ITask[];
                    self.tasks.forEach(element => {
                        if (1 !== element.state ) {
                            self.taskInError = self.taskInError + 1;
                        }
                    });
                    self.isLoading = false;
                },
            );
    }



    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        sessionStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
        localStorage.setItem("langage", language);
    }
}
