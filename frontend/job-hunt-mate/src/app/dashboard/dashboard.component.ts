import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  applicationStats = {
    total: 12,
    active: 8,
    interviewing: 2,
    rejected: 2,
    accepted: 0
  };

  recentActivity = [
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
    }
  ];

  upcomingInterviews = [
    {
      company: 'Google',
      position: 'UX Designer',
      date: '05/02/2025',
      time: '10:00 AM',
      type: 'Technical Interview'
    }
  ];
}
