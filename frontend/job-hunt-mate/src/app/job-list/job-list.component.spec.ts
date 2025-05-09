import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { JobListComponent } from './job-list.component';
import { JobService, JobApplication } from '../services/job.service';
import { NotificationService } from '../services/notification.service';
import { EnumLabelPipe } from '../pipes/enum-label.pipe';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;
  let jobServiceSpy: jasmine.SpyObj<JobService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockJobs: JobApplication[] = [
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      company: 'Tech Inc',
      location: 'Remote',
      jobType: 'Full-time',
      status: 'APPLIED',
      salary: '100,000',
      description: 'Building web applications',
      dateApplied: '2025-04-01',
      resumeLink: 'resume.pdf',
      notes: 'Great company culture',
      interviewDate: null,
      interviewMode: null,
      lastUpdated: '2025-04-01'
    },
    {
      id: '2',
      jobTitle: 'Backend Developer',
      company: 'Data Corp',
      location: 'New York, NY',
      jobType: 'Full-time',
      status: 'INTERVIEWING',
      salary: '120,000',
      description: 'Building APIs',
      dateApplied: '2025-04-05',
      resumeLink: 'resume.pdf',
      notes: 'Technical interview scheduled',
      interviewDate: '2025-04-15',
      interviewMode: 'Video Call',
      lastUpdated: '2025-04-10'
    }
  ];

  beforeEach(async () => {
    jobServiceSpy = jasmine.createSpyObj('JobService', ['getJobApplications', 'deleteJob']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    jobServiceSpy.getJobApplications.and.returnValue(of(mockJobs));

    await TestBed.configureTestingModule({
      imports: [JobListComponent, EnumLabelPipe, ConfirmModalComponent],
      providers: [
        { provide: JobService, useValue: jobServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch jobs on init', () => {
    expect(jobServiceSpy.getJobApplications).toHaveBeenCalled();
    expect(component.jobs).toEqual(mockJobs);
    expect(component.displayedJobs.length).toBe(Math.min(mockJobs.length, component.itemsPerPage));
  });

  it('should handle empty job list', () => {
    jobServiceSpy.getJobApplications.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.jobs.length).toBe(0);
    expect(component.displayedJobs.length).toBe(0);
  });

  it('should handle error when fetching jobs', () => {
    jobServiceSpy.getJobApplications.and.returnValue(throwError(() => new Error('Failed to fetch jobs')));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.jobs.length).toBe(0);
    expect(component.displayedJobs.length).toBe(0);
  });

  it('should navigate to add job form', () => {
    component.openAddJobForm();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/jobs/add']);
  });

  it('should navigate to view job detail', () => {
    const jobId = '1';
    component.viewJob(jobId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/jobs/view', jobId]);
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Create more mock data for pagination tests
      const manyJobs: JobApplication[] = [];
      for (let i = 0; i < 25; i++) {
        manyJobs.push({
          ...mockJobs[0],
          id: `job-${i}`,
          jobTitle: `Job ${i}`
        });
      }
      jobServiceSpy.getJobApplications.and.returnValue(of(manyJobs));
      component.itemsPerPage = 10;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display correct number of jobs per page', () => {
      expect(component.displayedJobs.length).toBe(10);
      expect(component.totalPages).toBe(3);
    });

    it('should navigate to next page', () => {
      component.nextPage();
      expect(component.currentPage).toBe(2);
      expect(component.displayedJobs.length).toBe(10);
      expect(component.displayedJobs[0].id).toBe('job-10');
    });

    it('should navigate to previous page', () => {
      component.nextPage(); // Go to page 2
      component.previousPage(); // Back to page 1
      expect(component.currentPage).toBe(1);
      expect(component.displayedJobs[0].id).toBe('job-0');
    });

    it('should not go beyond first page', () => {
      component.previousPage(); // Should stay on page 1
      expect(component.currentPage).toBe(1);
    });

    it('should not go beyond last page', () => {
      component.currentPage = 3;
      component.updateDisplayedJobs();
      component.nextPage(); // Should stay on page 3
      expect(component.currentPage).toBe(3);
    });
  });

  describe('Delete job functionality', () => {
    it('should delete a job and refresh the list', fakeAsync(() => {
      jobServiceSpy.deleteJob.and.returnValue(of(void 0));
      component.jobIdToDelete = '1';
      component.showDeleteConfirm = true;

      component.confirmDelete();
      tick();

      expect(jobServiceSpy.deleteJob).toHaveBeenCalledWith('1');
      expect(jobServiceSpy.getJobApplications).toHaveBeenCalledTimes(2); // Once on init, once after delete
      expect(component.showDeleteConfirm).toBeFalse();
      expect(component.jobIdToDelete).toBeNull();
    }));

    it('should handle error when deleting job', fakeAsync(() => {
      jobServiceSpy.deleteJob.and.returnValue(throwError(() => new Error('Failed to delete')));
      component.jobIdToDelete = '1';
      component.showDeleteConfirm = true;

      component.confirmDelete();
      tick();

      expect(jobServiceSpy.deleteJob).toHaveBeenCalledWith('1');
      expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Failed to delete job');
      expect(component.showDeleteConfirm).toBeTrue();
      expect(component.jobIdToDelete).toBe('1');
    }));

    it('should cancel delete operation', () => {
      component.jobIdToDelete = '1';
      component.showDeleteConfirm = true;

      component.cancelDelete();

      expect(component.showDeleteConfirm).toBeFalse();
      expect(component.jobIdToDelete).toBeNull();
      expect(jobServiceSpy.deleteJob).not.toHaveBeenCalled();
    });
  });
});
