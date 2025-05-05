import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  jobType: string;
  applicationDate: string;
  status: 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
}

export interface ApplicationStats {
  total: number;
  active: number;
  interviewing: number;
  rejected: number;
  accepted: number;
}

export interface ActivityItem {
  action: string;
  company: string;
  position: string;
  date: string;
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

  constructor(private http: HttpClient) { }

  getJobApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl).pipe(
      retry(this.RETRY_COUNT),
      catchError(this.handleError<JobApplication[]>('getJobApplications', []))
    );
  }

  getJobById(jobId: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${jobId}`).pipe(
      retry(this.RETRY_COUNT),
      catchError(this.handleError<JobApplication>('getJobById'))
    );
  }

  createJob(job: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, job).pipe(
      catchError(this.handleError<JobApplication>('createJob'))
    );
  }

  updateJob(job: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${job.id}`, job).pipe(
      catchError(this.handleError<JobApplication>('updateJob'))
    );
  }

  deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${jobId}`).pipe(
      catchError(this.handleError<void>('deleteJob'))
    );
  }

  getApplicationStats(): Observable<ApplicationStats> {
    return this.http.get<ApplicationStats>(`${this.apiUrl}/stats`).pipe(
      retry(this.RETRY_COUNT),
      catchError(this.handleError<ApplicationStats>('getApplicationStats', {
        total: 0,
        active: 0,
        interviewing: 0,
        rejected: 0,
        accepted: 0
      }))
    );
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/activity`).pipe(
      retry(this.RETRY_COUNT),
      catchError(this.handleError<ActivityItem[]>('getRecentActivity', []))
    );
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviews`).pipe(
      retry(this.RETRY_COUNT),
      catchError(this.handleError<Interview[]>('getUpcomingInterviews', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Let the user know what went wrong
      const userMessage = this.getUserErrorMessage(error);
      // Here you could emit this message to a notification service
      console.error(userMessage);

      // Return a safe result if provided, otherwise propagate the error
      return result !== undefined ? of(result) : throwError(() => error);
    };
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