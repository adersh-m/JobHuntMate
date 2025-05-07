import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, ApplicationStats, ActivityItem, Interview } from '../services/job.service';
import { HumanizePipe } from '../pipes/humanize.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HumanizePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  applicationStats!: ApplicationStats;
  recentActivity: ActivityItem[] = [];
  upcomingInterviews: Interview[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobService.getApplicationStats().subscribe(stats => {
      this.applicationStats = stats;
    });

    this.jobService.getRecentActivity().subscribe(activity => {
      this.recentActivity = activity;
    });

    this.jobService.getUpcomingInterviews().subscribe(interviews => {
      this.upcomingInterviews = interviews;
    });
  }
}
