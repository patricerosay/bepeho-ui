import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoRecordsComponent } from './video-records.component';

const routes: Routes = [
    {
        path: '',
        component: VideoRecordsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideoRecordsRoutingModule {}
