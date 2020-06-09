import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewComponent } from './interview.component';
import { PageHeaderModule } from '../../shared';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BandwidthModule } from '../../shared/modules/bandwidth/bandwidth.module';
import { AdressbookModule } from '../../shared/modules/adressbook/adressbook.module';
import { WebrtcConfigModule } from '../../shared/modules/webrtc-config/webrtc-config.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
    imports: [
        AdressbookModule,
        BandwidthModule,
        WebrtcConfigModule,
        TranslateModule,
        CommonModule, InterviewRoutingModule, PageHeaderModule,

        HttpClientModule,
        MatAutocompleteModule,

        MatButtonModule,
        MatButtonToggleModule,

        MatSelectModule,

        NgbModule

        ],
    declarations: [InterviewComponent],
    providers: [ScriptService],
    entryComponents: [InterviewComponent],
        exports: [InterviewComponent]


})
export class InterviewModule {}
