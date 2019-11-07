import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Input() gotoUrl: string;
    @Input() viewName: string;
    @Output() event: EventEmitter<any> = new EventEmitter();
    constructor(private router: Router) {}

    searchTimer = null;
    displayValue: string;
    computeValueToDisplay() {
      if ( undefined === this.count || ! this.count || 0 >= this.count) {
        return 'started';
      }
      const hours = Math.floor((this.count % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((this.count % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.count % (1000 * 60)) / 1000);

      const time = ((hours < 10 ) ? ('0' + hours) : hours)
      + 'h:' + ((minutes < 10 ) ? ('0' + minutes) : minutes)
      + 'm:' + ((seconds < 10 ) ? ('0' + seconds) : seconds) + 's';

      return time;
    }
    ngOnInit() {
      this.searchTimer = setInterval(this.refreshTimer, 1000, this);

      this.displayValue = this.computeValueToDisplay();
    }
    refreshTimer(_self: CountdownComponent) {
      _self.count = _self.count - 1000;
      _self.displayValue = _self.computeValueToDisplay();
    }
    public gotoPage() {
      this.router.navigateByUrl(this.gotoUrl);
    }
}
