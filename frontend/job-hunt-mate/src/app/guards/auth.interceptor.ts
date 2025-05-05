import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

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

    // Add auth token if available
    const token = this.authService.getToken();
    if (token && this.isApiUrl(req.url)) {
      secureReq = secureReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(secureReq);
  }

  private isApiUrl(url: string): boolean {
    return url.startsWith(environment.apiUrl);
  }

  private getCsrfToken(): string {
    // In a real application, this would get the token from a cookie or meta tag
    // For now, we'll use a placeholder implementation
    let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      token = this.generateCsrfToken();
      this.storeCsrfToken(token);
    }
    return token;
  }

  private generateCsrfToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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
}
