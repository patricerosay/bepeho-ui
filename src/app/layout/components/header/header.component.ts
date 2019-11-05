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

    constructor(private translate: TranslateService, public router: Router, public http: HttpClient) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
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


    private urlProcess = '/recorder/processStates';
    private urlStatus = '/recorder/recapProcessStates ';
    isLoading = true;
    tasks: ITask[];
    taskInError = 0;
    status = 0;
    ngOnInit()  {
        this.pushRightClass = 'push-right';
        const self = this;
        this.http.get(this.urlStatus)
        .subscribe(
            data => {
                self.status = data['RecapProgressStatus'] as number;
            },
        );
        this.http.get(this.urlProcess)
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
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
