import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor() {
        this.sliders.push(
            {
                imagePath: 'assets/images/Cam111478880527.png',
                label: 'Direction Change.',
                text:
                    '10 minutes ago.'
            },
            {
                imagePath: 'assets/images/Cam121478880527.png',
                label: 'Speed below target.',
                text: '4 hours ago.'
            },
            {
                imagePath: 'assets/images/Cam131478880586.png',
                label: 'Sudden heel angle',
                text:
                    'Yesterday.'
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `The clip was successfully created`
            },
            {
                id: 2,
                type: 'warning',
                message: `There was a probleme while sending the clip on the server. Will re-try in 42 minutes`
            }
        );
    }

    ngOnInit() {}

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
