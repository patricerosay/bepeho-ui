import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';

import { PlotComponent } from '../shared/plot/plot.component';
import { PlotlyService } from '../shared/plotly.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [],
    exports: [PlotComponent]
})

export class PlotlyModule {
    constructor() {
        PlotlyService.setPlotly(PlotlyJS);
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PlotlyModule,
            providers: [PlotlyService]
        };
    }
}
