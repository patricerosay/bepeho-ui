import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClipModule } from '../../shared';

import { VideoRecordsRoutingModule } from './video-records-routing.module';
import { VideoRecordsComponent } from './video-records.component';
import { PageHeaderModule } from '../../shared';
import { HttpClientModule } from '@angular/common/http';
// import {CdkTreeModule} from '@angular/cdk/tree';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
@NgModule({
    imports: [TranslateModule,
        CommonModule, VideoRecordsRoutingModule, PageHeaderModule,
        HttpClientModule,
        // MatAutocompleteModule,
        // MatBadgeModule,
        // MatBottomSheetModule,
        // MatButtonModule,
        // MatButtonToggleModule,
        // MatCardModule,
        // MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatDatepickerModule,
        // MatDialogModule,
        // MatDividerModule,
        // MatExpansionModule,
        // MatGridListModule,
        // MatIconModule,
        // MatInputModule,
        // MatListModule,
         MatMenuModule,
        // MatNativeDateModule,
         MatPaginatorModule,
        // MatProgressBarModule,
         MatProgressSpinnerModule,
        // MatRadioModule,
        // MatRippleModule,
        // MatSelectModule,
        // MatSidenavModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        // MatSnackBarModule,
         MatSortModule,
         MatTableModule,
        // MatTabsModule,
        // MatToolbarModule,
        // MatTooltipModule,
        // MatTreeModule,
        // MatCheckboxModule,
        // CdkStepperModule,
        // CdkTableModule,
        // CdkTreeModule,
        // ScrollingModule,
         ClipModule,
        NgbAlertModule],
    declarations: [VideoRecordsComponent],
    entryComponents: [VideoRecordsComponent]

})
export class VideoRecordsModule {}
