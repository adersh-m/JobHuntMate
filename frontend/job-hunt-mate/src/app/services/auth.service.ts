import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from "jwt-decode";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface DecodedToken {
  nameid: string;  // This will contain the user ID
  unique_name: string;
  email: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private currentUserSubject = new BehaviorSubject<{id: string} | null>(this.getCurrentUserFromToken());
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUserId(): string | null {
    debugger
    return this.currentUserSubject.value?.id || null;
  }

  private getCurrentUserFromToken(): {id: string} | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return { id: decoded.nameid };
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next({ id: response.user.id });
      })
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next({ id: response.user.id });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
}
