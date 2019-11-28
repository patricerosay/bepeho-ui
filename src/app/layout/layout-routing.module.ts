import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'mosaic', loadChildren: './mosaic/mosaic.module#MosaicModule' },
            { path: 'worker', loadChildren: './worker/worker.module#WorkerModule' },
            { path: 'map', loadChildren: './map/map.module#MapModule' },
            { path: 'video-list', loadChildren: './video-list/video-list.module#VideoListModule' },
            { path: 'version', loadChildren: './version/version.module#VersionModule' },
            { path: 'task', loadChildren: './task/task.module#TaskModule' },
            { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule', canActivate: [AuthGuard] },
           { path: 'video-records', loadChildren: './video-records/video-records.module#VideoRecordsModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
