import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';
import { firstValueFrom } from 'rxjs';
import { FEATURE_FLAGS } from '../app.config';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default feature flags', async () => {
    const flags = await firstValueFrom(service.getAllFeatureFlags());
    expect(flags).toEqual(FEATURE_FLAGS);
  });

  it('should update feature flag', async () => {
    service.updateFeatureFlag('enablePremiumFeatures', true);
    const isEnabled = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
    expect(isEnabled).toBe(true);
  });

  it('should get all feature flags', async () => {
    const flags = await firstValueFrom(service.getAllFeatureFlags());
    expect(flags).toBeDefined();
    expect(typeof flags.enablePremiumFeatures).toBe('boolean');
  });

  it('should persist feature flags between service instances', () => {
    service.updateFeatureFlag('enablePremiumFeatures', true);
    
    // Create a new instance
    const newService = TestBed.inject(FeatureFlagService);
    
    firstValueFrom(newService.isFeatureEnabled('enablePremiumFeatures')).then(isEnabled => {
      expect(isEnabled).toBe(true);
    });
  });
});
