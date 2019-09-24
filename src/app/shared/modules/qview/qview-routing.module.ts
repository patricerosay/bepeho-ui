import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QviewComponent } from './qview.component';

const routes: Routes = [
    {
        path: '',
        component: QviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QviewRoutingModule {}
