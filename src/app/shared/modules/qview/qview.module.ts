import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QviewComponent, BuildSmartClipModal } from './qview.component';
import { HttpClientModule } from '@angular/common/http';
import { VgCoreModule,VgControlsModule,VgBufferingModule, VgOverlayPlayModule } from 'ngx-videogular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
    imports: [
        MatFormFieldModule,
        CommonModule,
        HttpClientModule,
        VgCoreModule,
        VgControlsModule,
        VgBufferingModule,
        VgOverlayPlayModule,

        // MatAutocompleteModule,
        // MatBadgeModule,
        // MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        // MatCardModule,
        // MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatDatepickerModule,
        MatDialogModule,
        // MatDividerModule,
        // MatExpansionModule,
        // MatGridListModule,
        MatIconModule,
        // MatInputModule,
        // MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
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
        NgbModule, FormsModule],
    declarations: [QviewComponent,  BuildSmartClipModal],
    entryComponents: [QviewComponent, BuildSmartClipModal],
    exports: [QviewComponent, BuildSmartClipModal]

})
export class QviewModule {}
