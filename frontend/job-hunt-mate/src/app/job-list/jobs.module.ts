import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobListComponent } from './job-list.component';
import { AddJobModalComponent } from '../components/add-job-modal/add-job-modal.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { SharedModule } from '../shared/components/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: JobListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddJobModalComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: AddJobModalComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: AddJobModalComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    JobListComponent,
    AddJobModalComponent
  ]
})
export class JobsModule { }