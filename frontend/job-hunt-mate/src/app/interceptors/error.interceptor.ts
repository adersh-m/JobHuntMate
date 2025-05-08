import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        
        // Don't show errors for token refresh attempts
        const isRefreshRequest = request.url.includes('/auth/refresh');

        switch (error.status) {
          case 401:
            if (!isRefreshRequest) {
              // Only handle auth errors that aren't from refresh attempts
              this.handleAuthError();
            }
            errorMessage = 'Session expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'A server error occurred. Please try again later';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }

        // Don't show notification for refresh token failures
        if (!isRefreshRequest) {
          this.notificationService.showError(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }

  private handleAuthError(): void {
    this.authService.clearAuthData();
    this.router.navigate(['/login']);
  }
}