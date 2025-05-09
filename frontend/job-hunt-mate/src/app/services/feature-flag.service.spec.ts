import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';
import { FEATURE_FLAGS } from '../app.config';
import { firstValueFrom, take } from 'rxjs';
import { FeatureFlags } from '../interfaces/feature.interfaces';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureFlagService]
    });
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Feature flag initialization', () => {
    it('should initialize with default feature flags from app config', async () => {
      const flags = await firstValueFrom(service.getAllFeatureFlags());
      expect(flags).toEqual(FEATURE_FLAGS);
    });
  
    it('should provide correct default value for enablePremiumFeatures', async () => {
      const isEnabled = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
      expect(isEnabled).toBe(FEATURE_FLAGS.enablePremiumFeatures);
    });
  });

  describe('Feature flag updates', () => {
    it('should update feature flag and emit new value', async () => {
      // Enable premium features
      service.updateFeatureFlag('enablePremiumFeatures', true);
      
      // Check that the flag was updated
      const isEnabled = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
      expect(isEnabled).toBe(true);
      
      // Check all flags are correctly updated
      const allFlags = await firstValueFrom(service.getAllFeatureFlags());
      expect(allFlags.enablePremiumFeatures).toBe(true);
    });
  
    it('should update feature flag without affecting other flags', async () => {
      // Add a mock flag if more feature flags are added in the future
      // For now we only have one flag, so we'll test the structure is preserved
      const originalFlags = await firstValueFrom(service.getAllFeatureFlags());
      
      // Update the flag
      service.updateFeatureFlag('enablePremiumFeatures', true);
      
      // Get updated flags
      const updatedFlags = await firstValueFrom(service.getAllFeatureFlags());
      
      // Check structure is preserved (only the specific flag should change)
      expect(Object.keys(updatedFlags).length).toBe(Object.keys(originalFlags).length);
      expect(updatedFlags.enablePremiumFeatures).toBe(true);
    });
  
    it('should toggle feature flag value', async () => {
      // Get original value
      const originalValue = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
      
      // Toggle value
      service.updateFeatureFlag('enablePremiumFeatures', !originalValue);
      
      // Check it was toggled
      const newValue = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
      expect(newValue).toBe(!originalValue);
      
      // Toggle back
      service.updateFeatureFlag('enablePremiumFeatures', originalValue);
      const restoredValue = await firstValueFrom(service.isFeatureEnabled('enablePremiumFeatures'));
      expect(restoredValue).toBe(originalValue);
    });
  });

  describe('Observable behavior', () => {
    it('should emit feature flag changes to subscribers', (done) => {
      // Keep track of the emitted values
      const emittedValues: boolean[] = [];
      
      // Subscribe to the feature flag
      service.isFeatureEnabled('enablePremiumFeatures')
        .pipe(take(2)) // Take initial value and one update
        .subscribe({
          next: value => {
            emittedValues.push(value);
            if (emittedValues.length === 2) {
              // After receiving both values
              expect(emittedValues[0]).toBe(FEATURE_FLAGS.enablePremiumFeatures);
              expect(emittedValues[1]).toBe(true);
              done();
            }
          },
          error: err => done.fail(err)
        });
      
      // Update the flag to trigger a new emission
      service.updateFeatureFlag('enablePremiumFeatures', true);
    });
  
    it('should emit all feature flags to subscribers when any flag changes', (done) => {
      // Keep track of the emitted values
      const emittedFlagsArray: FeatureFlags[] = [];
      
      // Subscribe to all flags
      service.getAllFeatureFlags()
        .pipe(take(2)) // Take initial value and one update
        .subscribe({
          next: flags => {
            emittedFlagsArray.push({...flags});
            if (emittedFlagsArray.length === 2) {
              // After receiving both values
              expect(emittedFlagsArray[0].enablePremiumFeatures).toBe(FEATURE_FLAGS.enablePremiumFeatures);
              expect(emittedFlagsArray[1].enablePremiumFeatures).toBe(true);
              done();
            }
          },
          error: err => done.fail(err)
        });
      
      // Update a flag to trigger a new emission
      service.updateFeatureFlag('enablePremiumFeatures', true);
    });
  });

  describe('Service state across instances', () => {
    it('should maintain feature flag states across service instances', () => {
      // Update a flag in first instance
      service.updateFeatureFlag('enablePremiumFeatures', true);
      
      // Create a new instance
      const newService = TestBed.inject(FeatureFlagService);
      
      // Check if the new instance has the updated flag
      firstValueFrom(newService.isFeatureEnabled('enablePremiumFeatures')).then(isEnabled => {
        expect(isEnabled).toBe(true);
      });
    });
  });
});
