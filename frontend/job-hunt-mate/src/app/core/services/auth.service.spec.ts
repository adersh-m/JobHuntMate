// import { TestBed } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { AuthService, User } from './auth.service';
// import { ErrorHandlingService } from './error-handling.service';
// import { environment } from '../../environments/environment';

// describe('AuthService', () => {
//   let service: AuthService;
//   let httpMock: HttpTestingController;
//   let errorHandlingService: jasmine.SpyObj<ErrorHandlingService>;

//   const mockUser: User = {
//     id: '1',
//     name: 'Test User',
//     email: 'test@example.com'
//   };

//   const mockAuthResponse = {
//     token: 'mock.jwt.token',
//     refreshToken: 'mock.refresh.token',
//     user: mockUser
//   };

//   beforeEach(() => {
//     const errorHandlingServiceSpy = jasmine.createSpyObj('ErrorHandlingService', ['handleError']);
    
//     TestBed.configureTestingModule({
//       providers: [
//         AuthService,
//         { provide: ErrorHandlingService, useValue: errorHandlingServiceSpy },
//         provideHttpClient(withFetch()),
//         provideHttpClientTesting()
//       ]
//     });

//     service = TestBed.inject(AuthService);
//     httpMock = TestBed.inject(HttpTestingController);
//     errorHandlingService = TestBed.inject(ErrorHandlingService) as jasmine.SpyObj<ErrorHandlingService>;

//     // Clear localStorage before each test
//     localStorage.clear();
//   });

//   afterEach(() => {
//     httpMock.verify();
//     localStorage.clear();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('login', () => {
//     const credentials = {
//       usernameOrEmail: 'test@example.com',
//       password: 'password123'
//     };

//     it('should authenticate user and store tokens', () => {
//       service.login(credentials).subscribe(response => {
//         expect(response).toEqual(mockAuthResponse);
//         expect(localStorage.getItem(environment.authConfig.tokenKey)).toBe(mockAuthResponse.token);
//         expect(localStorage.getItem(environment.authConfig.refreshTokenKey)).toBe(mockAuthResponse.refreshToken);
//         expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
//       expect(req.request.method).toBe('POST');
//       req.flush(mockAuthResponse);
//     });

//     it('should handle login error', () => {
//       const errorResponse = { status: 401, statusText: 'Unauthorized' };

//       service.login(credentials).subscribe({
//         error: error => {
//           expect(errorHandlingService.handleError).toHaveBeenCalledWith(jasmine.any(Error));
//         }
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
//       req.flush('Invalid credentials', errorResponse);
//     });
//   });

//   describe('register', () => {
//     const registrationData = {
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'password123'
//     };

//     it('should register user and store tokens', () => {
//       service.register(registrationData).subscribe(response => {
//         expect(response).toEqual(mockAuthResponse);
//         expect(localStorage.getItem(environment.authConfig.tokenKey)).toBe(mockAuthResponse.token);
//         expect(localStorage.getItem(environment.authConfig.refreshTokenKey)).toBe(mockAuthResponse.refreshToken);
//         expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
//       expect(req.request.method).toBe('POST');
//       req.flush(mockAuthResponse);
//     });

//     it('should handle registration error', () => {
//       const errorResponse = { status: 400, statusText: 'Bad Request' };

//       service.register(registrationData).subscribe({
//         error: error => {
//           expect(errorHandlingService.handleError).toHaveBeenCalledWith(jasmine.any(Error));
//         }
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
//       req.flush('Email already exists', errorResponse);
//     });
//   });

//   describe('logout', () => {
//     beforeEach(() => {
//       localStorage.setItem(environment.authConfig.tokenKey, mockAuthResponse.token);
//       localStorage.setItem(environment.authConfig.refreshTokenKey, mockAuthResponse.refreshToken);
//       localStorage.setItem('user', JSON.stringify(mockUser));
//     });

//     it('should clear auth data on logout', () => {
//       service.logout();

//       expect(localStorage.getItem(environment.authConfig.tokenKey)).toBeNull();
//       expect(localStorage.getItem(environment.authConfig.refreshTokenKey)).toBeNull();
//       expect(localStorage.getItem('user')).toBeNull();
//     });
//   });

//   describe('refreshToken', () => {
//     beforeEach(() => {
//       localStorage.setItem(environment.authConfig.refreshTokenKey, mockAuthResponse.refreshToken);
//     });

//     it('should refresh tokens successfully', () => {
//       const newTokens = {
//         ...mockAuthResponse,
//         token: 'new.jwt.token',
//         refreshToken: 'new.refresh.token'
//       };

//       service.refreshToken().subscribe(response => {
//         expect(response).toEqual(newTokens);
//         expect(localStorage.getItem(environment.authConfig.tokenKey)).toBe(newTokens.token);
//         expect(localStorage.getItem(environment.authConfig.refreshTokenKey)).toBe(newTokens.refreshToken);
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
//       expect(req.request.method).toBe('POST');
//       expect(req.request.body).toEqual({ refreshToken: mockAuthResponse.refreshToken });
//       req.flush(newTokens);
//     });

//     it('should handle refresh token error', () => {
//       const errorResponse = { status: 401, statusText: 'Unauthorized' };

//       service.refreshToken().subscribe({
//         error: error => {
//           expect(errorHandlingService.handleError).toHaveBeenCalledWith(jasmine.any(Error));
//           expect(localStorage.getItem(environment.authConfig.tokenKey)).toBeNull();
//           expect(localStorage.getItem(environment.authConfig.refreshTokenKey)).toBeNull();
//         }
//       });

//       const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
//       req.flush('Invalid refresh token', errorResponse);
//     });

//     it('should return error when no refresh token available', () => {
//       localStorage.removeItem(environment.authConfig.refreshTokenKey);

//       service.refreshToken().subscribe({
//         error: error => {
//           expect(error.message).toBe('No refresh token available');
//         }
//       });

//       httpMock.expectNone(`${environment.apiUrl}/auth/refresh`);
//     });
//   });

//   describe('token management', () => {
//     it('should return current user', () => {
//       service['currentUserSubject'].next(mockUser);
//       expect(service.getCurrentUser()).toEqual(mockUser);
//     });

//     it('should check token validity', () => {
//       const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZXhwIjo5OTk5OTk5OTk5fQ.signature';
//       localStorage.setItem(environment.authConfig.tokenKey, validToken);
      
//       expect(service['hasValidToken']()).toBeTrue();
//     });

//     it('should handle invalid token', () => {
//       localStorage.setItem(environment.authConfig.tokenKey, 'invalid.token');
//       expect(service['hasValidToken']()).toBeFalse();
//     });
//   });
// });
