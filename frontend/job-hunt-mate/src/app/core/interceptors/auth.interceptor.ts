import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfToken = this.getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }
    }

    if (this.isApiUrl(req.url)) {
      const token = this.authService.getToken();
      if (token) {
        if (this.isTokenExpired(token)) {
          this.authService.clearAuthData();
          this.notificationService.showError('Session expired. Please log in again.');
          this.router.navigate(['/auth/login']);
          return throwError(() => new Error('Session expired'));
        }
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const secureReq = req.clone({ setHeaders: headers });

    return next.handle(secureReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(secureReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loginUrl = '/auth/login';
    const refreshUrl = '/auth/refresh-token';

    if (request.url.includes(loginUrl) || request.url.includes(refreshUrl)) {
      return throwError(() => new Error('Unauthorized access to auth endpoint.'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.token);
          return next.handle(this.addToken(request, response.token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.clearAuthData();
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private isApiUrl(url: string): boolean {
    return url.startsWith(environment.apiUrl);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.authService.decodeToken(token);
    const now = Math.floor(Date.now() / 1000);
    return !payload || payload.exp < now;
  }

  private getCsrfToken(): string {
    let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      token = this.generateCsrfToken();
      const meta = document.createElement('meta');
      meta.name = 'csrf-token';
      meta.content = token;
      document.head.appendChild(meta);
    }
    return token;
  }

  private generateCsrfToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
