import { Component, Output, EventEmitter, OnInit,OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ITask } from '../../../shared/interfaces/task-interface';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    recapProgressStatus = true;
    @Output() collapsedEvent = new EventEmitter<boolean>();
    searchViewMode = '/map';
    isSideBarCollapsed = false;
    getlangage(): string {
        const langage = localStorage.getItem("langage");
        if (!langage) return this.translate.getBrowserLang();
        return langage;
    }
    constructor(private translate: TranslateService,
        public router: Router,
        public http: HttpClient
        // private cookieService: CookieService
    ) {

        this.translate.addLangs(['en', 'fr', 'jp', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.getlangage();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

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
    private urlStatus = '/recorder/recapProcessStates';
    tasks: ITask[];
    taskInError = 0;
    isLoading = true;
    ngOnInit() {
        const self = this;
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.searchViewMode = '/' + localStorage.getItem('searchViewMode');
        this.collapsed = 'true' === localStorage.getItem('collapsed');
        this.collapsedEvent.emit(this.collapsed);

        this.startStatusWorker()

    }
    worker: any;
    stopStatusWorker(): void {
        if (null !== this.worker) {
          clearInterval(this.worker);
       
        }
      }
    getStatus(): void {
        const self = this;
        this.http.get(this.urlStatus + '?' + Math.random())
            .subscribe(
                data => {
                    self.recapProgressStatus = 1 === data['RecapProgressStatus'];
                },
            );
    }

    startStatusWorker(): void {
        this.getStatus();
        this.worker = setInterval(() => {
            this.getStatus();
        }, 60000);


    }
    ngOnDestroy() {
        console.log('ondestroy');
        this.stopStatusWorker();
      }
    gotoWIFI() {
        window.location.href = '/wifi';
    }
    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        localStorage.setItem('collapsed', this.collapsed ? 'true' : 'false');

        this.collapsedEvent.emit(this.collapsed);
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

    changeLang(language: string) {
        this.translate.use(language);
        localStorage.setItem("langage", language);
    }

    onLoggedout() {
        sessionStorage.removeItem('isLoggedin');
    }
}
