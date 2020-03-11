import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ISearchParams } from '../../../shared/interfaces/search.interface';
import {saveAs as importedSaveAs} from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { ISearchStat } from '../map/map.component';
// import {CookieService} from 'ngx-cookie-service';
import { QviewComponent } from '../../../shared/modules/qview/qview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUrlScheme } from '@angular/compiler';


@Component({
    selector: 'app-video-list',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss'],
})

export class VideoListComponent implements AfterViewInit, OnInit {
    public searchViewMode = 'video-list';
    displayedColumns: string[] = ['created', 'speed',  'direction', 'img', 'state'];
    searchDatabase: SearchDatabase | null;
    data: IGroup[] = [];
    resultsLength = 0;

    posterIndex = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    resultMessage: string;
    connexionError: string;
    private searchTimer = null;
    public pageSize = 10;
    public pageSizeOptions: number[] = [10, 50, 100, 500, 1000, 10000];

    statColumns: string[] = ['from', 'to', 'sequenceCount', 'sequenceDisplayed', 'error'];

    searchStats:  ISearchStat[] = [
        { sequenceCount: 0, sequenceDisplayed: 0, error: 0, videoLess: 0, positionLess: 0, from: 0, to: 0 }
      ];

    searchPrms: ISearchParams = new ISearchParams();
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    heelRange = [
        {'name': 'Whatever the boat heeling', 'value': [-90, 90]},
        {'name': 'starboard', 'value': [-90, 0]},
        {'name': 'more than 45° starboard', 'value':  [-90, -45]},
        {'name': 'less than 45° starboard', 'value':  [-45, 0]},
        {'name': 'less than 45° port', 'value':  [0, 45]},
        {'name': 'more than 45° port', 'value':  [45, 90]},
        {'name': 'port', 'value':  [0, 90]}

      ];

      timeRange = [
        {'name': 'Whenever it was recorded', 'value': ['0', '10000000']},
        {'name': 'last 6 hours' , 'value' : ['0', '260']},
        {'name': 'last 24 hours', 'value': ['0', '1440']},
        {'name': 'last 7 days', 'value': ['0', '10080']},
        {'name': 'last 30 days',  'value': ['0', '302400']},

      ];

      speedRange = [
      {'name': 'Whatever the boat speed' , 'value': [0, 100]},
      {'name': '0 to 5' , 'value' : [0, 5]},
      {'name': '5 to 10', 'value' : [5, 10]},
      {'name': '10 to 15', 'value' : [10, 15]},
      {'name': '15 to 20', 'value' : [15, 20]},
      {'name': '20 to 30', 'value' : [20, 30]},
      {'name': '30 to 40', 'value' : [30, 40]},
      {'name': '40 To More', 'value' : [40, 100]},
    ];
    currentSpeedRangeName: string;
    currentHeelRangeName: string;
    currentTimeRangeName: string;
    constructor(private _httpClient: HttpClient,
        private modalService: NgbModal,
         private translate: TranslateService,
        // private cookieService: CookieService
        ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
      }
      getCookieInfo(key: string, def: string): string {
        const val = localStorage.getItem(key);
        return (val) ? val : def;
      }
      ngOnInit() {
        this.currentSpeedRangeName = this.getCookieInfo('speedRange', 'Whatever the recording time');
        this.currentHeelRangeName = this.getCookieInfo('heelRange', 'Whatever the boat heeling');
        this.currentTimeRangeName = this.getCookieInfo('timeRange', 'Whenever it was recorded');

    }
    public onsearchValueMode(mode: string) {
        localStorage.set('searchViewMode', mode);
      }
    public nextPoster() {
        this.posterIndex ++;
        console.log('change poster ' + this.posterIndex );

        this.loadData(this);
    }
    public previousPoster() {
        this.posterIndex --;
        console.log('change poster ' + this.posterIndex );

        this.loadData(this);
    }
    public getImg(row: any[]): string {
        if ( undefined === row) {
            return 'assets/images/white-noise.jpg';
        }
        let rowImg: string;
        const col = row [this.posterIndex];
        if ( undefined === col) {
            rowImg = 'assets/images/white-noise.jpg';
        } else if ( 'audio/mpeg' === col ['mime']) {
            rowImg =  'assets/images/white-noise.jpg';
        } else {
            rowImg =  '/media/' + col ['filename_i_file'];
        }
        return rowImg;
    }
    public getUrl(row): string {
        if ( 'audio/mpeg' === row['mime']) {
            return   '/media/' + row['filename_m_file'];
        } else {
        return  '/media/' + row ['filename_p_file'];
        }
    }
    public getID(row): string {
        return  row['GroupID'];
    }
    public getSubtitle(row: any []): string {
        const  rowUrl = '/media/subtitles/' + row[0]['GroupID'] + '.vtt';
        return rowUrl;
    }
    public getProperty(row: any [], prop: string ): string {
        return  row [0][prop];
    }
    public edit(url: string) {
        console.log(url);
        const modalRef = this.modalService.open(QviewComponent, {
            size: 'lg',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        //   modalRef.componentInstance.json =
        //     e.target.options.jsonPayload;
        //   modalRef.componentInstance.data = e.target.options.data;

    }
    public downloadThisFile(rows) {
        rows.forEach(element => {
            importedSaveAs(this.getUrl(element), element.mime);
        });

        this.resultMessage = 'downloaded';

    }
    public uploadThisFile(url: string, msg: string) {
        this.resultMessage = msg;
    }
    public Reset() {
        this.searchPrms = new ISearchParams();
        this.searchPrms.type = 'autorecord';
        this.loadData(this);
      }
    //   public onSearchOnTime(from: string, to: string) {
    //     this.searchPrms.start_time = [from, to];
    //     this.loadData(this);
    //   }
    //   public onSearchOnHeelAngle(event) {
    //     this.searchPrms.nmea_d_heel_d = event.value;
    //     this.loadData(this);
    //   }
    //   public onSearchOnSpeed(event) {
    //     this.searchPrms.nmea_d_bgs_d = event.value;
    //     this.loadData(this);
    //   }
    public onSearchOnTime(range) {
        if ( 'whatever the recording time' !== range.name) {
          this.searchPrms.start_time = range.value;
        } else {
          this.searchPrms.start_time = undefined;
        }
        localStorage.set('timeRange', range.name);

        this.loadData(this);
      }

      public onSearchOnHeelAngle(range) {

        this.searchPrms.nmea_d_heel_d = range.value;
        localStorage.set('heelRange', range.name);
        this.loadData(this);
      }
      public onSearchOnSpeed(range) {
        this.searchPrms.nmea_d_bgs_d = range.value;
        localStorage.set('speedRange', range.name);
        this.loadData(this);
      }
      onPageEvent(event) {
        this.searchPrms.count = event.pageSize;
        this.searchPrms.start = event.pageIndex * event.pageSize;
        // this.searchTimer = setTimeout(this.loadData, 1000, this);
      }

    ngAfterViewInit() {
        this.searchViewMode = this.getCookieInfo('searchViewMode', '');
        this.searchPrms.start = 0;
        this.searchPrms.count = this.pageSize;
        this.searchPrms.type = 'autorecord';
        this.loadData(this);
    }
    loadData(_self: VideoListComponent) {

        clearTimeout(_self.searchTimer);

        _self.searchDatabase = new SearchDatabase(_self._httpClient, _self.pageSize);

        // If the user changes the sort order, reset back to the first page.
        _self.sort.sortChange.subscribe(() => _self.paginator.pageIndex = 0);

        merge(_self.sort.sortChange, _self.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    _self.isLoadingResults = true;
                    return _self.searchDatabase.getGroups(
                        _self.sort.active, _self.sort.direction, _self.paginator.pageIndex, _self.searchPrms);
                }),
                map(data => {
                    _self.isLoadingResults = false;
                    _self.isRateLimitReached = false;
                    _self.resultsLength = data.docCount;
                    _self.searchStats[0].sequenceCount = data.groupCount;
                    // self.retrievedSequenceCount = self.data['groups'].length;

                    _self.searchStats[0].from = null;
                    data.groups.sort(function(a, b) {
                        // videos on top of audios
                        if (a['mime'] < b['mime']) {
                            return 1;
                        }
                        if (a['mime'] > b['mime']) {
                            return 0;
                        }
                        if (a ['Channel'] > b['Channel']) {
                            return 1;
                        }
                        if (a ['Channel'] < b['Channel']) {
                            return -1;
                        }
                        // a doit être égale à b
                        return 0;
                    });
                    return data.groups;
                }),
                catchError(() => {
                    _self.isLoadingResults = false;
                    _self.isRateLimitReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => _self.data = data);
    }
}

export interface SearchAPI {
    groups: [];
    groupCount: number;
    docCount: number;
}

export interface IGroup {
    created_at: string;
    number: string;
    state: string;
    title: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class SearchDatabase {
    constructor(private _httpClient: HttpClient, private elementPerPage) { }
    serialize(obj: any) {
        const params: URLSearchParams = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];

                params.set(key, element);
            }
        }

        return params;
    }
    getGroups(sort: string, order: string, page: number, searchPrms: ISearchParams): Observable<SearchAPI> {
        searchPrms.start = page * this.elementPerPage;
//        searchPrms.count = (page + 1) * this.elementPerPage;
        // searchPrms.count = this.elementPerPage;
        const params: URLSearchParams = this.serialize(searchPrms);

        const requestUrl = '/recorder/search?' + params;
        return this._httpClient.get<SearchAPI>(requestUrl);
    }
}
