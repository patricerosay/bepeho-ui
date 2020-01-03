import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaroomComponent } from './mediaroom.component';

const routes: Routes = [
    {
        path: '',
        component: MediaroomComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MediaroomRoutingModule {}
