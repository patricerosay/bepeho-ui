import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipComponent } from './clip.component';
import {VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, } from 'ngx-videogular';
@NgModule({
    imports: [CommonModule, VgCoreModule,
        VgControlsModule, VgOverlayPlayModule,
        VgBufferingModule],
    declarations: [ClipComponent],
    exports: [ClipComponent]
})
export class ClipModule {}
