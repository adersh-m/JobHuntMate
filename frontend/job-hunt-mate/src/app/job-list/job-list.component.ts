import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, JobApplication } from '../services/job.service';
import { EnumLabelPipe } from '../pipes/enum-label.pipe';
import { ConfirmModalComponent } from "../shared/confirm-modal/confirm-modal.component";
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, EnumLabelPipe, ConfirmModalComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: JobApplication[] = [];
  displayedJobs: JobApplication[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  showDeleteConfirm: boolean = false;
  jobIdToDelete: string | null = null;

  constructor(
    private jobService: JobService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.jobService.getJobApplications().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
        this.updateDisplayedJobs();
      },
      error: () => {
        this.jobs = [];
        this.updateDisplayedJobs();
      }
    });
  }

  updateDisplayedJobs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedJobs = this.jobs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedJobs();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedJobs();
    }
  }

  openAddJobForm() {
    this.router.navigate(['/jobs/add']);
  }

  viewJob(jobId: string) {
    this.router.navigate(['/jobs/view', jobId]);
  }

  confirmDelete() {
    if (this.jobIdToDelete) {
      this.jobService.deleteJob(this.jobIdToDelete).subscribe({
        next: () => {
          this.fetchJobs();
          this.cancelDelete();
        },
        error: () => {
          this.notificationService.showError('Failed to delete job');
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.jobIdToDelete = null;
  }
}
