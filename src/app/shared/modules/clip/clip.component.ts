import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-clip',
    templateUrl: './clip.component.html',
    styleUrls: ['./clip.component.scss']
})
export class ClipComponent implements OnInit {
    @Input() img: string;
    @Input() src: string;
    @Input() id: string;
    @Input() subtitle: string;
    @Input() gotoUrl: string;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
