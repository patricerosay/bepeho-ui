import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-qview',
    templateUrl: './qview.component.html',
    styleUrls: ['./qview.component.scss']
})



export class QviewComponent implements OnInit {

    constructor(public http: HttpClient, private route: ActivatedRoute) { }
    isLoading = false;
    ngOnInit() {
        var self = this;
        
        var groups = atob(this.route.snapshot.queryParamMap.getAll());

    }
    
}


