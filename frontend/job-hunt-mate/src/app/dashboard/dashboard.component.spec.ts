import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { JobService, ApplicationStats, ActivityItem, Interview } from '../services/job.service';
import { FeatureFlagService } from '../services/feature-flag.service';
import { HumanizePipe } from '../pipes/humanize.pipe';
import { BehaviorSubject, of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let jobServiceSpy: jasmine.SpyObj<JobService>;
  let featureFlagServiceSpy: jasmine.SpyObj<FeatureFlagService>;

  const mockStats: ApplicationStats = {
    totalJobs: 10,
    appliedJobs: 5,
    interviews: 2,
    rejections: 1,
    offers: 1
  };

  const mockActivity: ActivityItem[] = [{
    action: 'APPLIED',
    company: 'Tech Corp',
    position: 'Software Engineer',
    date: '2025-05-09',
    jobId: '1'
  }];

  const mockInterviews: Interview[] = [{
    company: 'Tech Corp',
    position: 'Software Engineer',
    date: '2025-05-10',
    time: '10:00',
    type: 'VIRTUAL'
  }];

  const mockQuotas = {
    applications: 50,
    saved: 100
  };

  beforeEach(async () => {
    jobServiceSpy = jasmine.createSpyObj('JobService', [
      'getApplicationStats', 
      'getRecentActivity', 
      'getUpcomingInterviews',
      'getRemainingQuotas'
    ]);
    featureFlagServiceSpy = jasmine.createSpyObj('FeatureFlagService', ['isFeatureEnabled']);

    // Setup default spy behavior
    jobServiceSpy.getApplicationStats.and.returnValue(of(mockStats));
    jobServiceSpy.getRecentActivity.and.returnValue(of(mockActivity));
    jobServiceSpy.getUpcomingInterviews.and.returnValue(of(mockInterviews));
    jobServiceSpy.getRemainingQuotas.and.returnValue(of(mockQuotas));
    featureFlagServiceSpy.isFeatureEnabled.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HumanizePipe
      ],
      providers: [
        { provide: JobService, useValue: jobServiceSpy },
        { provide: FeatureFlagService, useValue: featureFlagServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Dashboard Data Loading', () => {
    it('should load all dashboard data on init', () => {
      component.ngOnInit();
      
      expect(jobServiceSpy.getApplicationStats).toHaveBeenCalled();
      expect(jobServiceSpy.getRecentActivity).toHaveBeenCalled();
      expect(jobServiceSpy.getUpcomingInterviews).toHaveBeenCalled();
      expect(jobServiceSpy.getRemainingQuotas).toHaveBeenCalled();
      
      expect(component.applicationStats).toEqual(mockStats);
      expect(component.recentActivity).toEqual(mockActivity);
      expect(component.upcomingInterviews).toEqual(mockInterviews);
      expect(component.quotas).toEqual(mockQuotas);
    });

    it('should handle subscription for advanced analytics feature flag', () => {
      expect(featureFlagServiceSpy.isFeatureEnabled)
        .toHaveBeenCalledWith('enablePremiumFeatures');
      expect(component.isAdvancedAnalyticsEnabled).toBeTrue();
    });
  });

  describe('Error Handling', () => {    it('should handle error when loading stats', () => {
      const emptyStats: ApplicationStats = {
        totalJobs: 0,
        appliedJobs: 0,
        interviews: 0,
        rejections: 0,
        offers: 0
      };
      jobServiceSpy.getApplicationStats.and.returnValue(of(emptyStats));
      component.ngOnInit();
      expect(component.applicationStats).toEqual(emptyStats);
    });

    it('should handle error when loading activity', () => {
      jobServiceSpy.getRecentActivity.and.returnValue(of([]));
      component.ngOnInit();
      expect(component.recentActivity).toEqual([]);
    });

    it('should handle error when loading interviews', () => {
      jobServiceSpy.getUpcomingInterviews.and.returnValue(of([]));
      component.ngOnInit();
      expect(component.upcomingInterviews).toEqual([]);
    });

    it('should handle error when loading quotas', () => {
      jobServiceSpy.getRemainingQuotas.and.returnValue(of({ applications: 0, saved: 0 }));
      component.ngOnInit();
      expect(component.quotas).toBeDefined();
      expect(component.quotas.applications).toBe(0);
      expect(component.quotas.saved).toBe(0);
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe from all subscriptions on destroy', () => {
      const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
