import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipComponent } from './clip.component';
import {VgCoreModule} from 'node_modules/videogular2/compiled/core';
import {VgControlsModule} from 'node_modules/videogular2/compiled/controls';
import { VgBufferingModule } from 'node_modules/videogular2/compiled/buffering';
@NgModule({
    imports: [CommonModule, VgCoreModule,
        VgControlsModule,
        VgBufferingModule],
    declarations: [ClipComponent],
    exports: [ClipComponent]
})
export class ClipModule {}
