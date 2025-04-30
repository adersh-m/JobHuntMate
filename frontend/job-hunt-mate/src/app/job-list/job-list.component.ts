import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, JobApplication } from '../services/job.service';
import { AddJobModalComponent } from "../components/add-job-modal/add-job-modal.component";
import { EnumLabelPipe } from '../pipes/enum-label.pipe';
import { ConfirmModalComponent } from "../shared/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, AddJobModalComponent, EnumLabelPipe, ConfirmModalComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {

  jobs: JobApplication[] = [];
  displayedJobs: JobApplication[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  showModal = false;
  openMenuId: string | null = null;
  showDeleteConfirm: boolean = false;
  jobIdToDelete: string | null = null;
  selectedJob: JobApplication | null = null;

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.jobService.getJobApplications().subscribe(jobs => {
      this.jobs = jobs;
      this.totalPages = Math.ceil(this.jobs.length / this.itemsPerPage);
      this.updateDisplayedJobs();
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
    this.showModal = true;
  }

  addJob(job: any) {
    this.jobService.createJob(job).subscribe(() => {
      this.fetchJobs();
    });
  }

  editJob(job: JobApplication) {
    this.selectedJob = job;
    this.showModal = true;
    this.toggleMenu(job.id);
  }

  onSaveJob(updatedJob: JobApplication) {
    if (updatedJob.id) {
      this.jobService.updateJob(updatedJob).subscribe(() => {
        this.fetchJobs();
      });
    } else {
      this.jobService.createJob(updatedJob).subscribe(() => {
        this.fetchJobs();
      });
    }
    this.showModal = false;
  }

  deleteJob(jobId: string) {
    // const confirmDelete = confirm('Are you sure you want to delete this job?');
    // if (!confirmDelete) return;
    this.promptDelete(jobId);
  }

  toggleMenu(jobId: string) {
    this.openMenuId = this.openMenuId === jobId ? null : jobId;
  }

  closeAllMenus() {
    this.openMenuId = null;
  }

  promptDelete(id: string) {
    this.jobIdToDelete = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.jobIdToDelete) {
      this.jobService.deleteJob(this.jobIdToDelete).subscribe(() => {
        this.fetchJobs();
        this.cancelDelete();
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.jobIdToDelete = null;
  }
}
