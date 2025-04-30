import { Component, EventEmitter, Output } from '@angular/core';
import { JobApplication } from '../../services/job.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-add-job-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-job-modal.component.html',
  styleUrl: './add-job-modal.component.scss'
})
export class AddJobModalComponent {
  @Output() closeModal = new EventEmitter();
  @Output() jobAdded = new EventEmitter<any>();

  job: JobApplication = {
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    applicationDate: (new Date()).toISOString(),
    status: 'WISHLIST',
    jobType: ''
  };

  submitForm() {
    this.jobAdded.emit(this.job);
    this.close();
  }

  close() {
    this.closeModal.emit();
  }
}
