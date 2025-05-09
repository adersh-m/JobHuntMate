import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FeatureLimits, FREE_TIER_LIMITS, PREMIUM_TIER_LIMITS } from '../interfaces/feature.interfaces';
import { FeatureFlagService } from './feature-flag.service';

type NumericFeature = 'maxActiveApplications' | 'maxSavedJobs' | 'maxNotes' | 'maxResumes';
type BooleanFeature = 'enableAdvancedAnalytics' | 'enableIntegrations' | 'enableBulkActions';

@Injectable({
  providedIn: 'root'
})
export class FeatureAccessService {
  private currentLimits: FeatureLimits = FREE_TIER_LIMITS;

  constructor(private featureFlagService: FeatureFlagService) {
    this.featureFlagService.isFeatureEnabled('enablePremiumFeatures')
      .subscribe(isPremium => {
        this.currentLimits = isPremium ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
      });
  }

  getCurrentLimits(): FeatureLimits {
    return this.currentLimits;
  }

  canAddNewApplication(currentCount: number): Observable<boolean> {
    return this.featureFlagService.isFeatureEnabled('enablePremiumFeatures').pipe(
      map(isPremium => {
        const limits = isPremium ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
        return currentCount < limits.maxActiveApplications;
      })
    );
  }

  canAddNewJob(currentCount: number): Observable<boolean> {
    return this.featureFlagService.isFeatureEnabled('enablePremiumFeatures').pipe(
      map(isPremium => {
        const limits = isPremium ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
        return currentCount < limits.maxSavedJobs;
      })
    );
  }

  isFeatureEnabled(featureName: BooleanFeature): boolean {
    return this.currentLimits[featureName];
  }

  getRemainingQuota(feature: NumericFeature, currentCount: number): Observable<number> {
    return this.featureFlagService.isFeatureEnabled('enablePremiumFeatures').pipe(
      map(isPremium => {
        const limits = isPremium ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;
        return Math.max(0, limits[feature] - currentCount);
      })
    );
  }
}