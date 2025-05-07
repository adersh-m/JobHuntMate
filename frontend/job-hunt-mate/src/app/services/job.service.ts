import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

export interface JobApplication {
  id?: string;
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
  offers: number;
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

  createJob(job: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, job).pipe(
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

  private handleError(operation: string, error: any): Observable<never> {
    const userMessage = this.getUserErrorMessage(error);
    this.notificationService.showError(userMessage);
    console.error(`${operation} failed:`, error);
    return throwError(() => error);
  }

  private getUserErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.status === 500) {
      return 'An unexpected server error occurred. Please try again later.';
    }
    return error.message || 'An unexpected error occurred.';
  }
}