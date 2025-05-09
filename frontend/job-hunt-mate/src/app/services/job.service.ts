import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { catchError, retry, tap, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';
import { FeatureAccessService } from './feature-access.service';
import { ErrorHandlingService } from './error-handling.service';

export interface JobApplication {
  id?: string | null;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  status: 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  salary: string;
  description: string;
  dateApplied: string;
  resumeLink: string;
  notes: string;
  interviewDate: string | null;
  interviewMode: string | null;
  lastUpdated: string;
}

export interface ApplicationStats {
  totalJobs: number;
  appliedJobs: number;
  interviews: number;
  rejections: number;
  offers: number | undefined;
}

export interface ActivityItem {
  action: string;
  company: string;
  position: string;
  date: string;
  jobId: string;
}

export interface Interview {
  company: string;
  position: string;
  date: string;
  time: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly apiUrl = `${environment.apiUrl}/jobs`;
  private readonly RETRY_COUNT = 3;
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    @Inject(FeatureAccessService) private featureAccess: FeatureAccessService,
    private notificationService: NotificationService
  ) { }

  getJobApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl).pipe(
      retry(this.RETRY_COUNT),
      catchError(error => this.handleError('getJobApplications', error))
    );
  }

  getJobById(jobId: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${jobId}`).pipe(
      retry(this.RETRY_COUNT),
      catchError(error => this.handleError('getJobById', error))
    );
  }
  createJob(job: Omit<JobApplication, 'id'>): Observable<JobApplication> {
    return this.getJobApplications().pipe(
      switchMap(jobs => {
        const activeCount = jobs.filter(j => j.status !== 'REJECTED').length;
        return this.featureAccess.canAddNewApplication(activeCount).pipe(
          map(canAdd => {
            if (!canAdd) {
              throw new Error('You have reached the maximum limit for active job applications in the free tier. Upgrade to add more!');
            }
            return job;
          })
        );
      }),
      switchMap(validatedJob => 
        this.http.post<JobApplication>(this.apiUrl, {
          ...validatedJob,
          id: null // Ensure id is explicitly set to null for new jobs
        })
      ),
      tap(() => {
        this.notificationService.showSuccess('Job application added successfully');
      }),
      catchError(error => this.handleError('createJob', error))
    );
  }

  updateJob(job: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${job.id}`, job).pipe(
      tap(() => {
        this.notificationService.showSuccess('Job application updated successfully');
      }),
      catchError(error => this.handleError('updateJob', error))
    );
  }

  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${jobId}`).pipe(
      tap(() => {
        this.notificationService.showSuccess('Job application deleted successfully');
      }),
      catchError(error => this.handleError('deleteJob', error))
    );
  }

  getApplicationStats(): Observable<ApplicationStats> {
    return this.http.get<ApplicationStats>(`${this.apiUrl}/stats`).pipe(
      retry(this.RETRY_COUNT),
      map(stats => ({
        ...stats,
        totalJobs: stats.totalJobs,
        appliedJobs: stats.appliedJobs,
        interviews: stats.interviews,
        rejections: stats.rejections,
        offers: this.featureAccess.isFeatureEnabled('enableAdvancedAnalytics') ? stats.offers : undefined
      })),
      catchError(error => this.handleError('getApplicationStats', error))
    );
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/activity`).pipe(
      retry(this.RETRY_COUNT),
      catchError(error => this.handleError('getRecentActivity', error))
    );
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviews`).pipe(
      retry(this.RETRY_COUNT),
      catchError(error => this.handleError('getUpcomingInterviews', error))
    );
  }
  getRemainingQuotas(): Observable<{ applications: number; saved: number }> {
    return this.getJobApplications().pipe(
      switchMap(jobs => {
        const activeCount = jobs.filter(j => j.status !== 'REJECTED').length;
        const savedCount = jobs.length;
        return combineLatest([
          this.featureAccess.getRemainingQuota('maxActiveApplications', activeCount),
          this.featureAccess.getRemainingQuota('maxSavedJobs', savedCount)
        ]).pipe(
          map(([applications, saved = 0]) => ({
            applications,
            saved // Ensure 'saved' is always a number
          }))
        );
      })
    );
  }
  private handleError(operation: string, error: any): Observable<never> {
    console.error(`${operation} failed:`, error);
    return this.errorHandlingService.handleError(error);
  }
}