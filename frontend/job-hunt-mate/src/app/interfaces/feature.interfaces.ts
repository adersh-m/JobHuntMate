import { FEATURE_FLAGS } from '../app.config';

export type FeatureFlags = typeof FEATURE_FLAGS;

export interface FeatureLimits {
  maxActiveApplications: number;
  maxSavedJobs: number;
  maxNotes: number;
  maxResumes: number;
  enableAdvancedAnalytics: boolean;
  enableIntegrations: boolean;
  enableBulkActions: boolean;
}

export const FREE_TIER_LIMITS: FeatureLimits = {
  maxActiveApplications: 10,
  maxSavedJobs: 25,
  maxNotes: 500,
  maxResumes: 1,
  enableAdvancedAnalytics: false,
  enableIntegrations: false,
  enableBulkActions: false
};

export const PREMIUM_TIER_LIMITS: FeatureLimits = {
  maxActiveApplications: 100,
  maxSavedJobs: 250,
  maxNotes: 5000,
  maxResumes: 10,
  enableAdvancedAnalytics: true,
  enableIntegrations: true,
  enableBulkActions: true
};