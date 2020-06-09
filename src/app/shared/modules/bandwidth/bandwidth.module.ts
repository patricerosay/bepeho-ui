import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandwidthComponent } from './bandwidth.component';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
    imports: [
        TranslateModule,
        MatFormFieldModule,
         CommonModule,
        
         MatDialogModule,
        
         MatProgressBarModule,
       
    ],
    declarations: [BandwidthComponent],
    entryComponents: [BandwidthComponent],
    exports: [BandwidthComponent]

})
export class BandwidthModule {}
