import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, ApplicationStats, ActivityItem, Interview } from '../services/job.service';
import { HumanizePipe } from '../pipes/humanize.pipe';
import { FeatureFlagService } from '../services/feature-flag.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HumanizePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  applicationStats!: ApplicationStats;
  recentActivity: ActivityItem[] = [];
  upcomingInterviews: Interview[] = [];  quotas: { applications: number; saved: number } = { applications: 0, saved: 0 };
  isAdvancedAnalyticsEnabled: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private jobService: JobService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(      this.featureFlagService.isFeatureEnabled('enablePremiumFeatures')
        .subscribe(isEnabled => this.isAdvancedAnalyticsEnabled = isEnabled)
    );
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
