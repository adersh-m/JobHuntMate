import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, ApplicationStats, ActivityItem, Interview } from '../services/job.service';
import { HumanizePipe } from '../pipes/humanize.pipe';
import { FeatureFlagService } from '../services/feature-flag.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HumanizePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: ApplicationStats = {
    totalJobs: 0,
    appliedJobs: 0,
    interviews: 0,
    rejections: 0,
    offers: 0
  };
  activity: ActivityItem[] = [];
  interviews: Interview[] = [];
  isLoading = true;
  error: string | null = null;
  isAdvancedAnalyticsEnabled = false;
  quotas: { applications: number; saved: number; } = { applications: 0, saved: 0 };
  
  private dashboardSubscription?: Subscription;

  constructor(
    private jobService: JobService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }
  }

  private loadDashboard() {
    this.isLoading = true;
    this.error = null;

    // Clean up existing subscription if any
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }

    this.dashboardSubscription = forkJoin({
      featureFlag: this.featureFlagService.isFeatureEnabled('enablePremiumFeatures'),
      stats: this.jobService.getApplicationStats(),
      activity: this.jobService.getRecentActivity(),
      interviews: this.jobService.getUpcomingInterviews(),
      quotas: this.jobService.getRemainingQuotas()
    }).subscribe({
      next: (data) => {
        this.isAdvancedAnalyticsEnabled = data.featureFlag;
        this.stats = data.stats || {
          totalJobs: 0,
          appliedJobs: 0,
          interviews: 0,
          rejections: 0,
          offers: 0
        };
        this.activity = Array.isArray(data.activity) ? data.activity : [];
        this.interviews = Array.isArray(data.interviews) ? data.interviews : [];
        this.quotas = data.quotas || { applications: 0, saved: 0 };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  retryLoading(): void {
    this.loadDashboard();
  }

  getResponseRate(): number {
    if (!this.stats?.totalJobs) return 0;
    return (this.stats.interviews + this.stats.rejections) / this.stats.totalJobs;
  }
}
