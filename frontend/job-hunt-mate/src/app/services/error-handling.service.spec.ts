import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService } from './error-handling.service';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HTTP 400 error', async () => {
    const httpError = new HttpErrorResponse({
      error: 'Bad Request',
      status: 400,
      statusText: 'Bad Request'
    });

    try {
      await firstValueFrom(service.handleError(httpError));
    } catch (error: any) {
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toContain('Invalid request');
    }
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
  });

  it('should handle HTTP 401 error', async () => {
    const httpError = new HttpErrorResponse({
      error: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized'
    });

    try {
      await firstValueFrom(service.handleError(httpError));
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toContain('Please log in');
    }
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
  });

  it('should handle generic Error', async () => {
    const genericError = new Error('Test error');

    try {
      await firstValueFrom(service.handleError(genericError));
    } catch (error: any) {
      expect(error.message).toContain('application error');
      expect(error.technical).toBe('Test error');
    }
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
  });

  it('should handle unknown error types', async () => {
    const unknownError = { random: 'error' };

    try {
      await firstValueFrom(service.handleError(unknownError));
    } catch (error: any) {
      expect(error.message).toContain('unexpected error');
      expect(error.technical).toBeTruthy();
    }
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
  });
});
