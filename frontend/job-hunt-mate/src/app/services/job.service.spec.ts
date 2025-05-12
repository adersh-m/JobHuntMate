// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { JobService, JobApplication, ApplicationStats, ActivityItem, Interview } from './job.service';
// import { ErrorHandlingService } from './error-handling.service';
// import { NotificationService } from './notification.service';
// import { FeatureAccessService } from './feature-access.service';
// import { environment } from '../../environments/environment';
// import { firstValueFrom, of, throwError } from 'rxjs';
// import { combineLatest } from 'rxjs';

// describe('JobService', () => {
//   let service: JobService;
//   let httpMock: HttpTestingController;
//   let errorHandlingServiceSpy: jasmine.SpyObj<ErrorHandlingService>;
//   let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
//   let featureAccessServiceSpy: jasmine.SpyObj<FeatureAccessService>;

//   const mockJob: JobApplication = {
//     id: '1',
//     jobTitle: 'Software Engineer',
//     company: 'Tech Corp',
//     location: 'Remote',
//     jobType: 'FULL_TIME',
//     status: 'APPLIED',
//     salary: '$100k-$120k',
//     description: 'Senior Software Engineer position',
//     dateApplied: '2025-05-09',
//     resumeLink: 'resume.pdf',
//     notes: 'Initial application submitted',
//     interviewDate: null,
//     interviewMode: null,
//     lastUpdated: '2025-05-09'
//   };

//   const mockStats: ApplicationStats = {
//     totalJobs: 10,
//     appliedJobs: 5,
//     interviews: 2,
//     rejections: 1,
//     offers: 1
//   };

//   beforeEach(() => {
//     errorHandlingServiceSpy = jasmine.createSpyObj('ErrorHandlingService', ['handleError']);
//     notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
//     featureAccessServiceSpy = jasmine.createSpyObj('FeatureAccessService', [
//       'isFeatureEnabled',
//       'canAddNewApplication',
//       'getRemainingQuota'
//     ]);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         JobService,
//         { provide: ErrorHandlingService, useValue: errorHandlingServiceSpy },
//         { provide: NotificationService, useValue: notificationServiceSpy },
//         { provide: FeatureAccessService, useValue: featureAccessServiceSpy }
//       ]
//     });

//     service = TestBed.inject(JobService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('getJobApplications', () => {
//     it('should return list of job applications', async () => {
//       const mockJobs = [mockJob, { ...mockJob, id: '2' }];

//       const promise = firstValueFrom(service.getJobApplications());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockJobs);

//       const result = await promise;
//       expect(result).toEqual(mockJobs);
//     });

//     it('should handle error when fetching jobs', async () => {
//       errorHandlingServiceSpy.handleError.and.throwError('Network error');

//       try {
//         await firstValueFrom(service.getJobApplications());
//         fail('should have thrown an error');
//       } catch (e) {
//         expect(errorHandlingServiceSpy.handleError).toHaveBeenCalled();
//       }

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       req.error(new ErrorEvent('error'));
//     });
//   });

//   describe('getJobById', () => {
//     it('should return specific job application', async () => {
//       const promise = firstValueFrom(service.getJobById('1'));

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/1`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockJob);

//       const result = await promise;
//       expect(result).toEqual(mockJob);
//     });
//   });
//   describe('createJob', () => {
//     const newJob: Omit<JobApplication, 'id'> = {
//       jobTitle: 'New Position',
//       company: 'New Corp',
//       location: 'Remote',
//       jobType: 'FULL_TIME',
//       status: 'WISHLIST',
//       salary: '$90k-$110k',
//       description: 'New job description',
//       dateApplied: '2025-05-09',
//       resumeLink: 'resume.pdf',
//       notes: 'Initial notes',
//       interviewDate: null,
//       interviewMode: null,
//       lastUpdated: '2025-05-09'
//     };

//     beforeEach(() => {
//       featureAccessServiceSpy.canAddNewApplication = jasmine.createSpy().and.returnValue(of(true));
//     });

//     it('should create new job application when under limit', async () => {
//       const existingJobs = [mockJob]; // Only one existing job
//       const firstReq = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       firstReq.flush(existingJobs);

//       const promise = firstValueFrom(service.createJob(newJob));

//       const createReq = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       expect(createReq.request.method).toBe('POST');
//       expect(createReq.request.body).toEqual({ ...newJob, id: null });

//       const createdJob = { ...newJob, id: '3' };
//       createReq.flush(createdJob);

//       const result = await promise;
//       expect(result).toEqual(createdJob);
//       expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
//       expect(featureAccessServiceSpy.canAddNewApplication).toHaveBeenCalledWith(1);
//     });

//     it('should throw error when application limit is reached', async () => {
//       featureAccessServiceSpy.canAddNewApplication.and.returnValue(of(false));
//       const existingJobs = [mockJob, { ...mockJob, id: '2' }];
      
//       const firstReq = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       firstReq.flush(existingJobs);

//       try {
//         await firstValueFrom(service.createJob(newJob));
//         fail('should have thrown error');
//       } catch (error: any) {
//         expect(error.message).toContain('maximum limit');
//       }
      
//       httpMock.expectNone(`${environment.apiUrl}/jobs`);
//     });
//   });

//   describe('updateJob', () => {
//     it('should update existing job application', async () => {
//       const updatedJob = { ...mockJob, notes: 'Updated notes' };

//       const promise = firstValueFrom(service.updateJob(updatedJob));

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/${updatedJob.id}`);
//       expect(req.request.method).toBe('PUT');
//       expect(req.request.body).toEqual(updatedJob);

//       req.flush(updatedJob);

//       const result = await promise;
//       expect(result).toEqual(updatedJob);
//       expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
//     });
//   });

//   describe('deleteJob', () => {
//     it('should delete job application', async () => {
//       const promise = firstValueFrom(service.deleteJob('1'));

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/1`);
//       expect(req.request.method).toBe('DELETE');

//       req.flush({});

//       await promise;
//       expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
//     });
//   });

//   describe('getApplicationStats', () => {
//     it('should return application statistics', async () => {
//       featureAccessServiceSpy.isFeatureEnabled.and.returnValue(true);

//       const promise = firstValueFrom(service.getApplicationStats());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/stats`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockStats);

//       const result = await promise;
//       expect(result).toEqual(mockStats);
//     });

//     it('should hide offers when advanced analytics is disabled', async () => {
//       featureAccessServiceSpy.isFeatureEnabled.and.returnValue(false);

//       const promise = firstValueFrom(service.getApplicationStats());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/stats`);
//       req.flush(mockStats);

//       const result = await promise;
//       expect(result.offers).toBeUndefined();
//     });
//   });

//   describe('getRecentActivity', () => {
//     it('should return recent activities', async () => {
//       const mockActivities: ActivityItem[] = [{
//         action: 'APPLIED',
//         company: 'Tech Corp',
//         position: 'Software Engineer',
//         date: '2025-05-09',
//         jobId: '1'
//       }];

//       const promise = firstValueFrom(service.getRecentActivity());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/activity`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockActivities);

//       const result = await promise;
//       expect(result).toEqual(mockActivities);
//     });
//   });

//   describe('getUpcomingInterviews', () => {
//     it('should return upcoming interviews', async () => {
//       const mockInterviews: Interview[] = [{
//         company: 'Tech Corp',
//         position: 'Software Engineer',
//         date: '2025-05-10',
//         time: '10:00',
//         type: 'VIRTUAL'
//       }];

//       const promise = firstValueFrom(service.getUpcomingInterviews());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs/interviews`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockInterviews);

//       const result = await promise;
//       expect(result).toEqual(mockInterviews);
//     });
//   });

//   describe('getRemainingQuotas', () => {
//     it('should return remaining quotas', async () => {
//       const mockJobs = [mockJob, { ...mockJob, id: '2', status: 'REJECTED' }];
//       const maxActiveQuota = 10;
//       const maxSavedQuota = 20;

//       featureAccessServiceSpy.getRemainingQuota
//         .withArgs('maxActiveApplications', 1)
//         .and.returnValue(of(maxActiveQuota - 1));
//       featureAccessServiceSpy.getRemainingQuota
//         .withArgs('maxSavedJobs', 2)
//         .and.returnValue(of(maxSavedQuota - 2));

//       const promise = firstValueFrom(service.getRemainingQuotas());

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       expect(req.request.method).toBe('GET');
//       req.flush(mockJobs);

//       const result = await promise;
//       expect(result).toEqual({
//         applications: maxActiveQuota - 1,
//         saved: maxSavedQuota - 2
//       });
//       expect(featureAccessServiceSpy.getRemainingQuota)
//         .toHaveBeenCalledWith('maxActiveApplications', 1);
//       expect(featureAccessServiceSpy.getRemainingQuota)
//         .toHaveBeenCalledWith('maxSavedJobs', 2);
//     });

//     it('should handle error when checking quotas', async () => {
//       errorHandlingServiceSpy.handleError.and.throwError('Quota check failed');

//       try {
//         await firstValueFrom(service.getRemainingQuotas());
//         fail('should have thrown an error');
//       } catch (e) {
//         expect(errorHandlingServiceSpy.handleError).toHaveBeenCalled();
//       }

//       const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
//       req.error(new ErrorEvent('error'));
//     });
//   });

//   // describe('Error Handling', () => {
//   //   it('should use error handling service', () => {
//   //     const error = new Error('test error');
//   //     errorHandlingServiceSpy.handleError.and.returnValue(throwError(() => error));
//   //     expect(() => service['handleError']('test', error))
//   //       .toThrowError('test error');
//   //   });
//   // });
// });
