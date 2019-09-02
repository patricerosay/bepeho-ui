import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'bs-component', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            { path: 'linear-charts', loadChildren: './linear-charts/linear-charts.module#LinearChartsModule' },
            { path: 'mosaic', loadChildren: './mosaic/mosaic.module#MosaicModule' },

            { path: 'map', loadChildren: './map/map.module#MapModule' },
            { path: 'version', loadChildren: './version/version.module#VersionModule' },
            { path: 'task', loadChildren: './task/task.module#TaskModule' },
            { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule' },
            { path: 'video-records', loadChildren: './video-records/video-records.module#VideoRecordsModule' },

            // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
