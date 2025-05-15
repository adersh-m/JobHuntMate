import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FeatureFlagAdminComponent } from './feature-flag-admin/feature-flag-admin.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'feature-flags',
    component: FeatureFlagAdminComponent,
    canActivate: [AuthGuard],
    title: 'Feature Flag Administration'
  }
];

@NgModule({
  declarations: [
    FeatureFlagAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    FeatureFlagAdminComponent
  ]
})
export class AdminModule { }