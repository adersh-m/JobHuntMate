import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FEATURE_FLAGS } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags = new BehaviorSubject<typeof FEATURE_FLAGS>(FEATURE_FLAGS);

  isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): Observable<boolean> {
    return new BehaviorSubject<boolean>(this.featureFlags.value[feature]);
  }

  updateFeatureFlag(feature: keyof typeof FEATURE_FLAGS, enabled: boolean): void {
    const currentFlags = this.featureFlags.value;
    this.featureFlags.next({
      ...currentFlags,
      [feature]: enabled
    });
  }

  getAllFeatureFlags(): Observable<typeof FEATURE_FLAGS> {
    return this.featureFlags.asObservable();
  }
}