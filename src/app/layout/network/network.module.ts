import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';

import { NetworkRoutingModule } from './network-routing.module';
import { NetworkComponent } from './network.component';
import {
    MatButtonModule,
    MatProgressBarModule
} from '@angular/material';
import { StatModule } from '../../shared';
@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule,
        NgbAlertModule,
        NetworkRoutingModule,
        Ng2Charts,
        TranslateModule, MatButtonModule,
        MatProgressBarModule,
        StatModule
    ],
    declarations: [
        NetworkComponent,
    ]
})
export class NetworkModule {}
