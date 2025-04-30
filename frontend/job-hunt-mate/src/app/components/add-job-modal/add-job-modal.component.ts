import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobApplication } from '../../services/job.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-job-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-job-modal.component.html',
  styleUrl: './add-job-modal.component.scss'
})
export class AddJobModalComponent implements OnInit {
  
  @Input() job: JobApplication | null = null;
  @Output() onSave = new EventEmitter<JobApplication>();
  @Output() onCancel = new EventEmitter();

  jobForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      status: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      description: [''],
      applicationDate: [(new Date()).toISOString(), Validators.required],
    });

    if (this.job !== undefined && this.job !== null) {
      this.jobForm.patchValue(this.job);
    }
  }

  submitForm() {    
    if (this.jobForm.valid) {
      const updatedJob = { ...this.job, ...this.jobForm.value };
      this.onSave.emit(updatedJob);
      this.jobForm.reset();
      this.job = null; // Reset the job after saving  
      this.close();
    }
  }

  close() {
    this.onCancel.emit();
  }
}
