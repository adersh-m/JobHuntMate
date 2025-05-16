import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { FeatureFlags } from '../../interfaces/feature.interfaces';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-feature-flag-admin',
  templateUrl: './feature-flag-admin.component.html',
  styleUrls: ['./feature-flag-admin.component.scss']
})
export class FeatureFlagAdminComponent implements OnInit {
  featureFlags$: Observable<FeatureFlags>;

  constructor(
    private featureFlagService: FeatureFlagService,
    private notificationService: NotificationService
  ) {
    this.featureFlags$ = this.featureFlagService.getAllFeatureFlags();
  }

  ngOnInit(): void {
    this.loadFeatureFlags();
  }

  toggleFeature(flagName: keyof FeatureFlags, currentValue: boolean): void {
    this.featureFlagService.updateFeatureFlag(flagName, !currentValue);
    this.notificationService.showSuccess(`${this.formatFlagName(flagName)} has been ${!currentValue ? 'enabled' : 'disabled'}`);
  }

  enableAllFeatures(): void {
    this.featureFlagService.updateFeatureFlag('enablePremiumFeatures', true);
    this.notificationService.showSuccess('All premium features have been enabled');
  }

  disableAllFeatures(): void {
    this.featureFlagService.updateFeatureFlag('enablePremiumFeatures', false);
    this.notificationService.showSuccess('All premium features have been disabled');
  }

  private loadFeatureFlags(): void {
    // Initial load is handled by constructor
  }

  objectKeys(obj: FeatureFlags): Array<keyof FeatureFlags> {
    return Object.keys(obj) as Array<keyof FeatureFlags>;
  }

  formatFlagName(flag: string): string {
    return flag
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  getFeatureDescription(flag: string): string {
    const descriptions: Record<string, string> = {
      enablePremiumFeatures: 'Enable all premium features and capabilities',
      enableAdvancedAnalytics: 'Access detailed analytics and insights about job applications',
      enableCalendarIntegration: 'Sync interviews and deadlines with your calendar',
      enableMultipleResumes: 'Upload and manage multiple versions of your resume',
      enableCustomization: 'Customize the application interface and workflows'
    };
    return descriptions[flag] || 'No description available';
  }

  async updateFeatureFlag(flagName: keyof FeatureFlags, enabled: boolean): Promise<void> {
    try {
      await this.featureFlagService.updateFeatureFlag(flagName, enabled);
      this.notificationService.showSuccess(`Feature flag "${flagName}" has been ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      this.notificationService.showError('Failed to update feature flag');
      console.error('Error updating feature flag:', error);
    }
  }
}
