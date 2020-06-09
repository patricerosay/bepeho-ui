import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipComponent } from './clip.component';
import {VgCoreModule, VgControlsModule, VgBufferingModule} from 'ngx-videogular';
@NgModule({
    imports: [CommonModule, VgCoreModule,
        VgControlsModule,
        VgBufferingModule],
    declarations: [ClipComponent],
    exports: [ClipComponent]
})
export class ClipModule {}
