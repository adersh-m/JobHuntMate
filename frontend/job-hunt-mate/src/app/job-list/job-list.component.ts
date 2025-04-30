import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, JobApplication } from '../services/job.service';
import { AddJobModalComponent } from "../components/add-job-modal/add-job-modal.component";
import { EnumLabelPipe } from '../pipes/enum-label.pipe';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, AddJobModalComponent, EnumLabelPipe],
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

  constructor(private jobService: JobService) {}

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
      this.fetchJobs(); // Refresh list
    });
  }
}
