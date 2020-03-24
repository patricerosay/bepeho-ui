import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandwidthComponent } from './bandwidth.component';

const routes: Routes = [
    {
        path: '',
        component: BandwidthComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BandwidthRoutingModule {}
