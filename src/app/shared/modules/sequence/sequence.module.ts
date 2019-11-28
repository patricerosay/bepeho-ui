import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceComponent } from './sequence.component';
import {VgCoreModule} from 'node_modules/videogular2/compiled/core';
import {VgControlsModule} from 'node_modules/videogular2/compiled/controls';
import { VgBufferingModule } from 'node_modules/videogular2/compiled/buffering';
@NgModule({
    imports: [CommonModule, VgCoreModule,
        VgControlsModule,
        VgBufferingModule],
    declarations: [SequenceComponent],
    exports: [SequenceComponent]
})
export class SequenceModule {}
