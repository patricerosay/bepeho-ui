import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdressbookComponent } from './adressbook.component';

const routes: Routes = [
    {
        path: '',
        component: AdressbookComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdressbookRoutingModule {}
