import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceComponent } from './sequence.component';
import { VgCoreModule, VgControlsModule, VgBufferingModule, VgOverlayPlayModule } from 'ngx-videogular';

@NgModule({
    imports: [CommonModule, VgCoreModule,
        VgControlsModule,
        VgBufferingModule,
        VgOverlayPlayModule],
    declarations: [SequenceComponent],
    exports: [SequenceComponent]
})
export class SequenceModule { }
