import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginHubloComponent } from './login-hublo.component';

const routes: Routes = [
    {
        path: '',
        component: LoginHubloComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginHubloRoutingModule {}
