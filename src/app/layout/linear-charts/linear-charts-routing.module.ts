import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinearChartsComponent } from './linear-charts.component';

const routes: Routes = [
    {
        path: '',
        component: LinearChartsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LinearChartsRoutingModule {}
