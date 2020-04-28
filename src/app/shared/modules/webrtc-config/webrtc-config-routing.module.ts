import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebrtcConfigComponent } from './webrtc-config.component';

const routes: Routes = [
    {
        path: '',
        component: WebrtcConfigComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebrtcConfigRoutingModule {}
