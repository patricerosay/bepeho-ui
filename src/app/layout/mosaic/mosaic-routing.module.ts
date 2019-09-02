import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MosaicComponent } from './mosaic.component';

const routes: Routes = [
    {
        path: '',
        component: MosaicComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MosaicRoutingModule {}
