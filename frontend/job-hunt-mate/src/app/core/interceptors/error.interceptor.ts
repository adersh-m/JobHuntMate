import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../services/error-handling.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        // Don't handle errors for token refresh attempts
        const isRefreshRequest = request.url.includes('/auth/refresh');
        
        if (error.status === 401 && !isRefreshRequest) {
          this.handleAuthError();
        }

        // Only delegate error, do not show notification here
        return throwError(() => error);
      })
    );
  }

  private handleAuthError(): void {
    this.authService.clearAuthData();
    this.router.navigate(['/login']);
  }
}