import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add security headers to all requests
    let secureReq = req.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      }
    });

    // Add CSRF token for mutation requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfToken = this.getCsrfToken();
      secureReq = secureReq.clone({
        setHeaders: {
          'X-CSRF-TOKEN': csrfToken
        }
      });
    }

    // Add auth token if available and if it's an API URL
    if (this.isApiUrl(req.url)) {
      const token = this.authService.getToken();
      if (token) {
        if (this.isTokenExpired(token)) {
          this.authService.clearAuthData();
          this.notificationService.showError('Session expired. Please log in again.');
          this.router.navigate(['/auth/login']);
          return throwError(() => new Error('Session expired'));
        }
        secureReq = secureReq.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(secureReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Handle 401 error - try to refresh token if not already trying
          return this.handle401Error(secureReq, next, error.error.message);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, message: string = ''): Observable<HttpEvent<any>> {
    debugger
    const loginUrl = '/auth/login';
    const refreshUrl = '/auth/refresh-token';

    // Don't try to refresh if the 401 is from login or refresh endpoints
    if( request.url.includes(loginUrl)) {
      return throwError(() => new Error(message));
    } 
    else if (request.url.includes(refreshUrl)) {
      return throwError(() => new Error('Unauthorized - not refreshing token for auth endpoints.'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.token);

          // Retry the failed request with new token
          return next.handle(this.addToken(request, response.token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          // If refresh fails, clear auth and propagate error
          return throwError(() => err);
        })
      );
    }

    // Wait for the token to be refreshed
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next.handle(this.addToken(request, token));
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isApiUrl(url: string): boolean {
    return url.startsWith(environment.apiUrl);
  }

  private getCsrfToken(): string {
    let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      token = this.generateCsrfToken();
      this.storeCsrfToken(token);
    }
    return token;
  }

  private generateCsrfToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private storeCsrfToken(token: string): void {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = token;
    document.head.appendChild(meta);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.authService.decodeToken(token);
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
