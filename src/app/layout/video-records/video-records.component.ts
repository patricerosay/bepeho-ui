import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ISearchParams } from '../../shared/interfaces/search.interface';
import {saveAs as importedSaveAs} from 'file-saver';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-map',
    templateUrl: './video-records.component.html',
    styleUrls: ['./video-records.component.scss'],
})
export class VideoRecordsComponent implements AfterViewInit {
    displayedColumns: string[] = ['created', 'img', 'title', 'state', 'action'];
    exampleDatabase: SearchDatabase | null;
    data: GithubIssue[] = [];
    elementPerPage = 5;
    resultsLength = 0;
    isLoadingResults = true;
    // isRateLimitReached = false;
    resultMessage: string;
    private mediaroot = '/media/master_records/oceanrecorder/';
    searchPrms: ISearchParams = new ISearchParams();
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    getlangage(): string {    
        const langage = localStorage.getItem("langage");
        if (! langage) return this.translate.getBrowserLang();
        return langage;
    }
    constructor(private _httpClient: HttpClient, private translate: TranslateService) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.getlangage();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
      }
    public getImg(row: []): string {
        const  rowUrl = this.mediaroot+ row['filename_i_file'];
        return rowUrl;
    }
    public getUrl(row: []): string {
        const  rowUrl = this.mediaroot + row['filename_p_file'];
        return rowUrl;
    }
    public getID(row: []): string {
        return  row['GroupID'];
    }
    public getState(row: []): string {
        return  row['State'];
    }
    public getSubtitle(row: []): string {
        const  rowUrl = this.mediaroot+'subtitles/' + row['GroupID'] + '.vtt';
        return rowUrl;
    }
    public downloadThisFile(url: string, msg: string) {
        importedSaveAs(url, 'video.mp4');
        this.resultMessage = msg;

    }
    // "{"id":"coolx1-30-4-2019_16-23","text":"<p><br></p>"}"
    public uploadThisFile(id: string, msg: string) {
        const params: URLSearchParams = new URLSearchParams();
        const prm = {'id': id,
                'text': ' empty'};

        this._httpClient.post<any>('/recorder', 'action=FileSystem&verb=send&prm=' + JSON.stringify(prm),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).subscribe(
            (res) => {
                console.log(res);
                this.resultMessage = 'Success';

            },
            (err) => {
                console.log(err);
                this.resultMessage = err.message;
            });
        this.resultMessage = msg;
    }

    ngAfterViewInit() {
        this.searchPrms.type = 'video_import';

        this.exampleDatabase = new SearchDatabase(this._httpClient, this.elementPerPage);

        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.exampleDatabase.getClips(
                        this.sort.active, this.sort.direction, this.paginator.pageIndex, this.searchPrms);
                }),
                map(data => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    // this.isRateLimitReached = false;
                    this.resultsLength = data.groupCount;

                    return data.groups;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    // this.isRateLimitReached = true;
                    return observableOf([]);
                })
            ).subscribe(data => this.data = data);
    }
}

export interface SearchAPI {
    groups: [];
    groupCount: number;
    docCount: number;
}

export interface GithubIssue {
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
    getClips(sort: string, order: string, page: number, searchPrms: ISearchParams): Observable<SearchAPI> {
        searchPrms.start = page * this.elementPerPage;
        searchPrms.count = (page + 1) * this.elementPerPage;
        const params: URLSearchParams = this.serialize(searchPrms);

        const requestUrl = '/api/records/search/?' + params;
        return this._httpClient.get<SearchAPI>(requestUrl);
    }
}
