import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpClient } from '@angular/common/http';
import { IStats } from './stat-interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})

export class DashboardComponent implements OnInit {
    public error: string = null;
    public doughnutChartType: string;
    // Doughnut
    public doughnutChartLabels: string[] = [
        'Used',
        'Left',
        'Reserved'
    ];
    public doughnutChartData: number[] = [350, 450, 100];
    private url = '/recorder/stats';
    isLoading = true;
    stats: IStats;
    constructor( private translate: TranslateService,
        public http: HttpClient) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
 
        this.doughnutChartType = 'doughnut';

    }
    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }


    ngOnInit() {

        const self = this;

        this.http.get(this.url)
            .subscribe(
                data => {
                    self.stats = data as IStats;
                    self.doughnutChartData[0]=self.stats.storageUsage;
                    self.doughnutChartData[1]=self.stats.storageLimit-self.stats.storageUsage;
                    self.doughnutChartData[2]=100-self.stats.storageLimit;

                    self.isLoading = false;
                },
                error => this.logError(error),
            );

    }
    logError(error: object): void {
        this.error = 'error';
    }
}
