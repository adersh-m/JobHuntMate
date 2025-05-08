import { Injectable } from '@angular/core';

export interface FeatureLimits {
  maxActiveApplications: number;
  maxSavedJobs: number;
  maxNotes: number;
  maxResumes: number;
  enableAdvancedAnalytics: boolean;
  enableIntegrations: boolean;
  enableBulkActions: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureAccessService {
  private readonly FREE_TIER_LIMITS: FeatureLimits = {
    maxActiveApplications: 10,
    maxSavedJobs: 25,
    maxNotes: 500,
    maxResumes: 1,
    enableAdvancedAnalytics: false,
    enableIntegrations: false,
    enableBulkActions: false
  };

  private currentLimits: FeatureLimits = this.FREE_TIER_LIMITS;

  getCurrentLimits(): FeatureLimits {
    return this.currentLimits;
  }

  canAddNewApplication(currentCount: number): boolean {
    return currentCount < this.currentLimits.maxActiveApplications;
  }

  canAddNewJob(currentCount: number): boolean {
    return currentCount < this.currentLimits.maxSavedJobs;
  }

  isFeatureEnabled(featureName: keyof FeatureLimits): boolean {
    if (typeof this.currentLimits[featureName] === 'boolean') {
      return this.currentLimits[featureName] as boolean;
    }
    return true;
  }

  getRemainingQuota(feature: 'maxActiveApplications' | 'maxSavedJobs' | 'maxNotes' | 'maxResumes', currentCount: number): number {
    return Math.max(0, this.currentLimits[feature] - currentCount);
  }
}