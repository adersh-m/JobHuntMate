import { Routes } from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AddJobModalComponent } from './components/add-job-modal/add-job-modal.component';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'jobs', component: JobListComponent, canActivate: [AuthGuard] },
  { path: 'jobs/add', component: AddJobModalComponent, canActivate: [AuthGuard] },
  { path: 'jobs/edit/:id', component: AddJobModalComponent, canActivate: [AuthGuard] },
  { path: 'jobs/view/:id', component: AddJobModalComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

