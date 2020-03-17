import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoginHubloRoutingModule } from './login-hublo-routing.module';
import { LoginHubloComponent } from './login-hublo.component';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

// import {
//     MatAutocompleteModule,
//     MatBadgeModule,
//     MatBottomSheetModule,
//     MatButtonModule,
//     MatButtonToggleModule,
//     MatCardModule,
//     MatCheckboxModule,
//     MatChipsModule,
//     MatDatepickerModule,
//     MatDialogModule,
//     MatDividerModule,
//     MatExpansionModule,
//     MatGridListModule,
//     MatIconModule,
//     MatInputModule,
//     MatListModule,
//     MatMenuModule,
//     MatNativeDateModule,
//     MatPaginatorModule,
//     MatProgressBarModule,
//     MatProgressSpinnerModule,
//     MatRadioModule,
//     MatRippleModule,
//     MatSelectModule,
//     MatSidenavModule,
//     MatSliderModule,
//     MatSlideToggleModule,
//     MatSnackBarModule,
//     MatSortModule,
//     MatStepperModule,
//     MatTableModule,
//     MatTabsModule,
//     MatToolbarModule,
//     MatTooltipModule,
//     MatTreeModule
// } from '@angular/material';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginHubloRoutingModule,
        FormsModule,
        MatFormFieldModule
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
        // MatCheckboxModule
    ],
    declarations: [LoginHubloComponent]
})
export class LoginHubloModule {}
