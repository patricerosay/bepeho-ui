import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdressbookComponent } from './adressbook.component';
import { HttpClientModule } from '@angular/common/http';
import {VgCoreModule} from 'node_modules/videogular2/compiled/core';
import {VgControlsModule} from 'node_modules/videogular2/compiled/controls';
import { VgBufferingModule } from 'node_modules/videogular2/compiled/buffering';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
} from '@angular/material';
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
         MatListModule,
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
    declarations: [AdressbookComponent],
    entryComponents: [AdressbookComponent],
    exports: [AdressbookComponent]

})
export class AdressbookModule {}
