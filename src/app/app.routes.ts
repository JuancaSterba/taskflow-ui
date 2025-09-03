import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'projects/new',
        component: ProjectFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'projects/:id/edit',
        component: ProjectFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'projects/:id',
        component: ProjectDetailComponent,
        canActivate: [authGuard]
    },

];
