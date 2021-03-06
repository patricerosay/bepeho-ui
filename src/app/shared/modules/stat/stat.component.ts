import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Input() gotoUrl: string;
    @Input() viewName: string;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor(private router: Router) {}

    ngOnInit() {}
    public gotoPage(){
      this.router.navigateByUrl(this.gotoUrl);
    }
}
