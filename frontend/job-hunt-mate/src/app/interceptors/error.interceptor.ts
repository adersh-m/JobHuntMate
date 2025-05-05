import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';
        
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid Credentials. Please try again';
            this.router.navigate(['/login']);
            break;
          case 401:
            errorMessage = 'Please log in to continue';
            this.router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'You do not have permission to access this resource';
            this.router.navigate(['/login']);
            break;
          case 404:
            errorMessage = 'The requested resource was not found';
            break;
          case 500:
            errorMessage = 'A server error occurred. Please try again later';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }

        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      })
    );
  }
}