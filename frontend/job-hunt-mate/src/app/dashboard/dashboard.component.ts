import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, ApplicationStats, ActivityItem, Interview } from '../services/job.service';
import { HumanizePipe } from '../pipes/humanize.pipe';
import { FeatureAccessService } from '../services/feature-access.service';

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
  quotas: { applications: number; saved: number } = { applications: 0, saved: 0 };
  isAdvancedAnalyticsEnabled: boolean;

  constructor(
    private jobService: JobService,
    private featureAccess: FeatureAccessService
  ) {
    this.isAdvancedAnalyticsEnabled = this.featureAccess.isFeatureEnabled('enableAdvancedAnalytics');
  }

  ngOnInit() {
    this.loadDashboard();
  }

  private loadDashboard() {
    this.jobService.getApplicationStats().subscribe(stats => {
      this.applicationStats = stats;
    });

    this.jobService.getRecentActivity().subscribe(activity => {
      this.recentActivity = activity;
    });

    this.jobService.getUpcomingInterviews().subscribe(interviews => {
      this.upcomingInterviews = interviews;
    });

    this.jobService.getRemainingQuotas().subscribe(quotas => {
      this.quotas = quotas;
    });
  }
}
