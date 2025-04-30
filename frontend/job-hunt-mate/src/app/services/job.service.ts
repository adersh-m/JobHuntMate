import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface JobApplication {
  title: string;
  company: string;
  location: string
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

  private apiUrl = 'https://localhost:44341/api';

  // private mockJobApplications: JobApplication[] = [
  //   {
  //     title: 'UX Designer',
  //     company: 'Google',
  //     applicationDate: '04/20/2025',
  //     status: 'interviewing'
  //   },
  //   {
  //     title: 'Product Manager',
  //     company: 'Microsoft',
  //     applicationDate: '04/15/2025',
  //     status: 'applied'
  //   },
  //   {
  //     title: 'Frontend Dev',
  //     company: 'Amazon',
  //     applicationDate: '04/05/2025',
  //     status: 'rejected'
  //   },
  //   {
  //     title: 'Data Scientist',
  //     company: 'Netflix',
  //     applicationDate: '03/28/2025',
  //     status: 'applied'
  //   },
  //   // Edge cases
  //   {
  //     title: 'Senior Full Stack Developer & DevOps Engineer (React/Node.js/AWS) - Remote/Hybrid',
  //     company: 'Super Long Company Name Industries International Corporation Ltd.',
  //     applicationDate: '04/30/2025',
  //     status: 'applied'
  //   },
  //   {
  //     title: 'Software Engineer with 特殊文字 & Special Characters !@#$%',
  //     company: 'Company with & Special © Characters™',
  //     applicationDate: '04/29/2025',
  //     status: 'interviewing'
  //   },
  //   {
  //     title: '',  // Empty title edge case
  //     company: 'Test Company',
  //     applicationDate: '04/28/2025',
  //     status: 'applied'
  //   },
  //   {
  //     title: 'Role with No Company',
  //     company: '',  // Empty company edge case
  //     applicationDate: '04/27/2025',
  //     status: 'rejected'
  //   },
  //   {
  //     title: 'Future Date Job',
  //     company: 'Future Corp',
  //     applicationDate: '05/01/2025',  // Future date
  //     status: 'applied'
  //   },
  //   {
  //     title: 'Old Application',
  //     company: 'Past Inc',
  //     applicationDate: '01/01/2020',  // Very old date
  //     status: 'rejected'
  //   },
  //   {
  //     title: 'Position with Accepted Status',
  //     company: 'Dream Job Inc',
  //     applicationDate: '04/15/2025',
  //     status: 'accepted'
  //   }
  // ];

  private mockStats: ApplicationStats = {
    total: 25,
    active: 15,
    interviewing: 5,
    rejected: 4,
    accepted: 1
  };

  private mockActivity: ActivityItem[] = [
    {
      action: 'Interview Scheduled',
      company: 'Google',
      position: 'UX Designer',
      date: '04/25/2025'
    },
    {
      action: 'Application Submitted',
      company: 'Microsoft',
      position: 'Product Manager',
      date: '04/15/2025'
    },
    {
      action: 'Application Rejected',
      company: 'Amazon',
      position: 'Frontend Dev',
      date: '04/10/2025'
    },
    // Edge cases
    {
      action: 'Multiple Interviews (Morning)',
      company: 'Super Long Company Name Industries International Corporation Ltd.',
      position: 'Very Long Position Title That Might Break The Layout If Not Handled Properly',
      date: '05/01/2025'
    },
    {
      action: 'Multiple Interviews (Afternoon)',
      company: 'Another Company',
      position: 'Second Interview Same Day',
      date: '05/01/2025'
    },
    {
      action: 'Offer Accepted! 🎉',  // With emoji
      company: 'Dream Job Inc',
      position: 'Position with Accepted Status',
      date: '04/15/2025'
    },
    {
      action: 'Follow-up Required',
      company: '',  // Empty company
      position: '',  // Empty position
      date: '04/14/2025'
    },
    {
      action: 'Application Withdrawn',
      company: 'Test Company with Very Very Very Very Very Very Very Very Very Very Long Name',
      position: 'Test Position with Very Very Very Very Very Very Very Very Very Very Long Title',
      date: '04/13/2025'
    }
  ];

  private mockInterviews: Interview[] = [
    {
      company: 'Google',
      position: 'UX Designer',
      date: '05/02/2025',
      time: '10:00 AM',
      type: 'Technical Interview'
    },
    // Edge cases
    {
      company: 'Super Long Company Name Industries International Corporation Ltd.',
      position: 'Senior Full Stack Developer & DevOps Engineer',
      date: '05/01/2025',
      time: '09:00 AM',
      type: 'Initial Screen'
    },
    {
      company: 'Another Company',
      position: 'Second Interview Same Day',
      date: '05/01/2025',
      time: '02:00 PM',
      type: 'Technical Interview'
    },
    {
      company: 'Company with Special Characters & Symbols',
      position: 'Role with 特殊文字',
      date: '05/03/2025',
      time: '11:59 PM',  // Edge time
      type: 'Final Interview & Team Meeting'
    },
    {
      company: 'Early Interview Corp',
      position: 'Early Bird Role',
      date: '05/04/2025',
      time: '12:01 AM',  // Edge time
      type: 'Coffee Chat'
    },
    {
      company: 'Marathon Corp',
      position: 'Endurance Tester',
      date: '05/05/2025',
      time: '09:00 AM',
      type: 'Full Day Interview (9 AM - 5 PM)'  // Long duration
    }
  ];

  constructor(private http: HttpClient) { }

  getJobApplications(): Observable<JobApplication[]> {
    return this.http.get<any>(`${this.apiUrl}/jobs`);
  }

  getApplicationStats(): Observable<ApplicationStats> {
    return of(this.mockStats);
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    return of(this.mockActivity);
  }

  getUpcomingInterviews(): Observable<Interview[]> {
    return of(this.mockInterviews);
  }

  createJob(job: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.apiUrl}/Jobs`, job);
  }
}