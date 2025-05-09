import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingService, ErrorDetails } from './error-handling.service';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    // Create spy for the NotificationService
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
    service = TestBed.inject(ErrorHandlingService);

    // Set up spy for console.error
    spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP Error Handling', () => {
    const httpErrorTestCases = [
      { status: 400, code: 'BAD_REQUEST', message: 'Invalid request' },
      { status: 401, code: 'UNAUTHORIZED', message: 'Please log in' },
      { status: 403, code: 'FORBIDDEN', message: 'permission' },
      { status: 404, code: 'NOT_FOUND', message: 'not found' },
      { status: 409, code: 'CONFLICT', message: 'conflicts' },
      { status: 429, code: 'RATE_LIMIT', message: 'Too many requests' },
      { status: 500, code: 'SERVER_ERROR', message: 'server error' }
    ];

    httpErrorTestCases.forEach(testCase => {
      it(`should handle HTTP ${testCase.status} error correctly`, async () => {
        const httpError = new HttpErrorResponse({
          error: 'Test Error',
          status: testCase.status,
          statusText: 'Error Status Text'
        });

        try {
          await firstValueFrom(service.handleError(httpError));
          fail('Expected error was not thrown');
        } catch (error: any) {
          expect(error.code).toBe(testCase.code);
          expect(error.message).toContain(testCase.message);
          expect(error.technical).toBeTruthy();
          
          // Verify notification was shown with correct message
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith(error.message);
          // Verify error was logged to console
          expect(console.error).toHaveBeenCalled();
        }
      });
    });

    it('should handle default (unknown) HTTP error status', async () => {
      const httpError = new HttpErrorResponse({
        error: 'Unknown Error',
        status: 0, // Unknown status
        statusText: 'Unknown'
      });

      try {
        await firstValueFrom(service.handleError(httpError));
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.code).toBe('UNKNOWN');
        expect(error.message).toContain('unexpected error');
        expect(notificationServiceSpy.showError).toHaveBeenCalled();
      }
    });

    it('should include server response details when available', async () => {
      const errorMessage = { message: 'Server validation failed', details: 'Email format is invalid' };
      const httpError = new HttpErrorResponse({
        error: errorMessage,
        status: 400,
        statusText: 'Bad Request'
      });

      try {
        await firstValueFrom(service.handleError(httpError));
      } catch (error: any) {
        expect(error.code).toBe('BAD_REQUEST');
        expect(error.technical).toBeTruthy();
      }
    });
  });

  describe('Generic Error Handling', () => {
    it('should handle standard JS Error objects', async () => {
      const genericError = new Error('Test error message');

      try {
        await firstValueFrom(service.handleError(genericError));
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toContain('application error');
        expect(error.technical).toBe('Test error message');
        expect(notificationServiceSpy.showError).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      }
    });

    it('should handle custom Error subclasses', async () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      
      const customError = new CustomError('Custom error message');

      try {
        await firstValueFrom(service.handleError(customError));
      } catch (error: any) {
        expect(error.message).toContain('application error');
        expect(error.technical).toBe('Custom error message');
      }
    });
  });

  describe('Unknown Error Handling', () => {
    it('should handle string error input', async () => {
      const stringError = 'String error message';

      try {
        await firstValueFrom(service.handleError(stringError));
      } catch (error: any) {
        expect(error.message).toContain('unexpected error');
        expect(error.technical).toContain('String error message');
      }
    });

    it('should handle object error input', async () => {
      const objectError = { errorCode: 123, text: 'Object error' };

      try {
        await firstValueFrom(service.handleError(objectError));
      } catch (error: any) {
        expect(error.message).toContain('unexpected error');
        expect(error.technical).toContain('123');
        expect(error.technical).toContain('Object error');
      }
    });

    it('should handle null or undefined error input', async () => {
      try {
        await firstValueFrom(service.handleError(null));
      } catch (error: any) {
        expect(error.message).toContain('unexpected error');
      }

      try {
        await firstValueFrom(service.handleError(undefined));
      } catch (error: any) {
        expect(error.message).toContain('unexpected error');
      }
    });
  });

  it('should return an Observable that can be subscribed to', () => {
    const httpError = new HttpErrorResponse({
      error: 'Bad Request',
      status: 400,
      statusText: 'Bad Request'
    });

    let errorCaught = false;
    service.handleError(httpError).subscribe({
      next: () => fail('Should not emit a value'),
      error: (err: ErrorDetails) => {
        errorCaught = true;
        expect(err.code).toBe('BAD_REQUEST');
      }
    });

    expect(errorCaught).toBeTrue();
  });
});
