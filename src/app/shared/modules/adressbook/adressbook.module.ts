import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdressbookComponent } from './adressbook.component';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
    imports: [
        TranslateModule,
        MatFormFieldModule,
         CommonModule,

         MatDialogModule,

         MatListModule,

         MatProgressBarModule,

    ],
    declarations: [AdressbookComponent],
    entryComponents: [AdressbookComponent],
    exports: [AdressbookComponent]

})
export class AdressbookModule {}
