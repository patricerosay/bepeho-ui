import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';
import { AuthGuardHublo } from '../shared';
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'mosaic', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'mosaic', loadChildren: './mosaic/mosaic.module#MosaicModule' },
            { path: 'interview', loadChildren: './interview/interview.module#InterviewModule', canActivate: [AuthGuardHublo] },
            // { path: 'network', loadChildren: './network/network.module#NetworkModule' },
            { path: 'worker', loadChildren: './worker/worker.module#WorkerModule' },
            { path: 'search/map', loadChildren: './search/map/map.module#MapModule' },
            { path: 'search/video-list', loadChildren: './search/video-list/video-list.module#VideoListModule' },
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
