import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Group } from './group-interface';

@Component({
    selector: 'app-qview',
    templateUrl: './qview.component.html',
    styleUrls: ['./qview.component.scss']
})



export class QviewComponent implements OnInit {

    constructor(public http: HttpClient, private route: ActivatedRoute) 
    {
        var groups = JSON.parse(atob(route.snapshot.queryParamMap.get("data"))) as any[];

     }
    isLoading = false;
    ngOnInit() {
        var self = this;
        

    }
    
}


