import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewRoutingModule } from './interview-routing.module';
import { InterviewComponent } from './interview.component';
import { PageHeaderModule } from '../../shared';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BandwidthModule } from '../../shared/modules/bandwidth/bandwidth.module';
import { AdressbookModule } from '../../shared/modules/adressbook/adressbook.module';
import { WebrtcConfigModule } from '../../shared/modules/webrtc-config/webrtc-config.module';

import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule} from '@angular/material';
@NgModule({
    imports: [
        AdressbookModule,
        BandwidthModule,
        WebrtcConfigModule,
        TranslateModule,
        CommonModule, InterviewRoutingModule, PageHeaderModule, LazyLoadImageModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatDatepickerModule,
        // MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        // MatIconModule,
        MatInputModule,
        MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
        // MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        // MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        // MatSnackBarModule,
        // MatSortModule,
        MatTableModule,
        MatTabsModule,
        // MatToolbarModule,
        // MatTooltipModule,
        // MatTreeModule,
        // MatCheckboxModule,
        FormsModule,
        NgbModule
        // NgbCarouselModule
        ],
    declarations: [InterviewComponent],
    providers: [ScriptService],
    entryComponents: [InterviewComponent],
        exports: [InterviewComponent]


})
export class InterviewModule {}
