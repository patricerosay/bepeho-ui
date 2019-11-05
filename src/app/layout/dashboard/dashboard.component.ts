import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpClient } from '@angular/common/http';
import { IStats } from './stat-interface';
import { TranslateService } from '@ngx-translate/core';
import { IWorker } from '../../shared/interfaces/worker-interface';

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

    getStats(_self: DashboardComponent) {
        _self.http.get(_self.url)
        .subscribe(
            data => {
                _self.stats = data as IStats;
                _self.doughnutChartData[0] = _self.stats.storageUsage;
                _self.doughnutChartData[1] = _self.stats.storageLimit - _self.stats.storageUsage;
                _self.doughnutChartData[2] = 100 - _self.stats.storageLimit;

                _self.getWorkers (_self);

            },
            error => this.logError(error),
        );
    }
    getWorkers (_self: DashboardComponent) {
        _self.http.get('/recorder/tasksTag')
        .subscribe(
          data => {
            const workers = data['tasks'] as IWorker[];
            _self.stats.workerCount = workers.length;

            _self.isLoading = false;

          },
        );
    }
    ngOnInit() {
        this.getStats(this);
    }
    logError(error: object): void {
        this.error = 'error';
    }
}
