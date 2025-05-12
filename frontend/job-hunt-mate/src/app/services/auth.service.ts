import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ErrorHandlingService } from './error-handling.service';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface DecodedToken {
  exp: number;
  sub: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private refreshTokenTimeout?: any;

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {
    if (this.hasValidToken()) {
      this.startRefreshTokenTimer();
      this.loadUserFromStorage();
    }
  }

  private handleError(error: HttpErrorResponse, options?: { suppressToast?: boolean }): Observable<never> {
    // Only show a user-friendly message for 401/404 on login, avoid duplicate toasts
    if ((error.status === 401 || error.status === 404) && error.url?.endsWith('/login')) {
      const backendMsg = error?.error?.message;
      this.errorHandlingService.handleError({
        ...error,
        error: { message: backendMsg || 'Invalid username or password.' }
      }, { suppressToast: true });
    } else {
      this.errorHandlingService.handleError(error, options);
    }
    return throwError(() => error);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Failed to parse user data from storage');
      }
    }
  }

  login(credentials: { usernameOrEmail: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.setUser(response.user);
        this.isAuthenticatedSubject.next(true);
        this.startRefreshTokenTimer();
        // Show toast only on successful login
        this.errorHandlingService.handleError({ error: { message: 'Login successful!' } }, { suppressToast: false });
      }),
      catchError(error => this.handleError(error, { suppressToast: true }))
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.setUser(response.user);
        this.isAuthenticatedSubject.next(true);
        this.startRefreshTokenTimer();
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    // this.http.post(`${this.apiUrl}/logout`, {}).pipe(
    //   catchError(error => this.handleError(error))
    // ).subscribe(() => {
    //   this.clearAuthData();
    // });

    this.clearAuthData();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.setUser(response.user);
        this.startRefreshTokenTimer();
      }),
      catchError(error => {
        this.clearAuthData();
        return this.handleError(error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  resetPassword(data: { email: string; token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(environment.authConfig.tokenKey, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(environment.authConfig.refreshTokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.authConfig.tokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(environment.authConfig.refreshTokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  public clearAuthData(): void {
    localStorage.removeItem(environment.authConfig.tokenKey);
    localStorage.removeItem(environment.authConfig.refreshTokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.stopRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expires = new Date(decoded.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, Math.max(0, timeout));
    } catch {
      console.error('Failed to start refresh timer');
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}
