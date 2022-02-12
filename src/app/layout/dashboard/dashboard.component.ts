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
    getlangage(): string {    
        const langage = localStorage.getItem("langage");
        if (! langage) return this.translate.getBrowserLang();
        return langage;
    }
    public doughnutChartData: number[] = [350, 450, 100];
    private url = '/api/records/stats/';
    isLoading = true;
    stats ={storageUsage: 0,
    documentCount:0,
    totalrecorderTime: 0,
    remainingVideoTime: 0,
    storageLimit: 0,
    clipCount: 0,
    eventCount:0,
    workerCount: 0
    }
    constructor( private translate: TranslateService,
        public http: HttpClient) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.getlangage();
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
        _self.http.get('/api/services/states/')
        .subscribe(
          data => {
            const workers = data['ProgressStatus'] as IWorker[];
            _self.stats.workerCount = workers.length;

            _self.isLoading = false;

          },
        );
    }
    ngOnInit() {
        
      //  this.getWorkers (this);
        this.getStats(this);
    }
    logError(error: object): void {
        this.error = 'error';
    }
}
