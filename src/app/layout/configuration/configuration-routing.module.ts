import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { FormsModule }   from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes),FormsModule],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
