import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { NotificationComponent } from '../components/notification/notification.component';
import { EnumLabelPipe } from '../pipes/enum-label.pipe';
import { HumanizePipe } from '../pipes/humanize.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalComponent,
    NotificationComponent,
    LoaderComponent,
    EnumLabelPipe,
    HumanizePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModalComponent,
    NotificationComponent,
    LoaderComponent,
    EnumLabelPipe,
    HumanizePipe
  ]
})
export class SharedModule { }