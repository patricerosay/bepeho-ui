import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebrtcConfigComponent } from './webrtc-config.component';
// import {VgCoreModule} from 'node_modules/videogular2/compiled/core';
// import {VgControlsModule} from 'node_modules/videogular2/compiled/controls';
// import { VgBufferingModule } from 'node_modules/videogular2/compiled/buffering';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
    imports: [
        TranslateModule,
        MatFormFieldModule,
         CommonModule,
        // HttpClientModule,
        // VgCoreModule,
        // VgControlsModule,
        // VgBufferingModule,
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
         MatDialogModule,
        // MatDividerModule,
        // MatExpansionModule,
        // MatGridListModule,
        // MatIconModule,
        // MatInputModule,
        // MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
         MatProgressBarModule,
        // MatProgressSpinnerModule,
        // MatRadioModule,
        // MatRippleModule,
        // MatSelectModule,
        // MatSidenavModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        // MatSnackBarModule,
        // MatSortModule,
        // MatTableModule,
        // MatTabsModule,
        // MatToolbarModule,
        // MatTooltipModule,
        // MatTreeModule,
        // MatCheckboxModule,
        // NgbModule, FormsModule
    ],
    declarations: [WebrtcConfigComponent],
    entryComponents: [WebrtcConfigComponent],
    exports: [WebrtcConfigComponent]

})
export class WebrtcConfigModule {}
