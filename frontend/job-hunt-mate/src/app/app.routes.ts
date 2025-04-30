import { Routes } from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  { path: 'dashboard', component: JobListComponent },
  { path: 'profile', component: JobListComponent },
  { path: 'settings', component: JobListComponent }
];
