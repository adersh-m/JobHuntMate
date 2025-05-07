import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from '../guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: SettingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    SettingsComponent
  ]
})
export class SettingsModule { }