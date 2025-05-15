import { Component, OnInit } from '@angular/core';
import { JobApplication, JobService } from '../../core/services/job.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-job-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './add-job-modal.component.html',
  styleUrl: './add-job-modal.component.scss'
})
export class AddJobModalComponent implements OnInit {
  jobForm!: FormGroup;
  isEditing = false;
  isViewing = false;
  jobId: string | null = null;
  isSubmitting = false;
  showDeleteConfirm = false;
  
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.url.subscribe(segments => {
      this.isViewing = segments[1]?.path === 'view';
      if (this.isViewing) {
        this.jobForm.disable();
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.jobId = params['id'];
        this.isEditing = !this.isViewing;
        this.loadJob(params['id']);
      }
    });
  }

  private initForm() {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      status: ['WISHLIST', Validators.required],
      salary: [''],
      description: [''],
      dateApplied: [new Date().toISOString().split('T')[0], Validators.required],
      resumeLink: [''],
      notes: [''],
      interviewDate: [null],
      interviewMode: [''],
      lastUpdated: [new Date().toISOString()]
    });
  }

  private loadJob(id: string) {
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        const formattedJob = {
          ...job,
          dateApplied: job.dateApplied.split('T')[0],
          interviewDate: job.interviewDate ? job.interviewDate.split('T')[0] : null
        };
        this.jobForm.patchValue(formattedJob);
      },
      error: () => {
        this.notificationService.showError('Failed to load job details');
        this.router.navigate(['/jobs']);
      }
    });
  }

  editJob() {
    if (this.jobId) {
      this.router.navigate(['/jobs/edit', this.jobId]);
    }
  }

  promptDelete() {
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.jobId) {
      this.jobService.deleteJob(this.jobId).subscribe({
        next: () => {
          this.router.navigate(['/jobs']);
        },
        error: () => {
          this.notificationService.showError('Failed to delete job');
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  submitForm() {    
    if (this.jobForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValues = this.jobForm.value;
      
      if (this.isEditing) {
        const jobData: JobApplication = {
          ...formValues,
          id: this.jobId!, // Only include ID if editing
          lastUpdated: new Date().toISOString()
        };

        this.jobService.updateJob(jobData).subscribe({
          next: () => {
            this.router.navigate(['/jobs']);
          },
          error: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        const jobApplication: Omit<JobApplication, 'id'> = {
          jobTitle: formValues.jobTitle,
          company: formValues.company,
          location: formValues.location,
          jobType: formValues.jobType,
          status: formValues.status,
          salary: formValues.salary,
          description: formValues.description,
          dateApplied: formValues.dateApplied,
          resumeLink: formValues.resumeLink,
          notes: formValues.notes,
          interviewDate: formValues.interviewDate,
          interviewMode: formValues.interviewMode,
          lastUpdated: new Date().toISOString()
        };

        this.jobService.createJob(jobApplication).subscribe({
          next: () => {
            this.router.navigate(['/jobs']);
          },
          error: () => {
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/jobs']);
  }
}
