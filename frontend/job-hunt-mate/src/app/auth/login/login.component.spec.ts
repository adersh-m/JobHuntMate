import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    authServiceSpy.login.and.returnValue(of({
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('usernameOrEmail')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.isLoading).toBeFalse();
    expect(component.loginError).toBeNull();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    form.controls['usernameOrEmail'].setValue('testuser');
    form.controls['password'].setValue('password123');
    expect(form.valid).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl).toBeTruthy();
    if (!passwordControl) return;
    passwordControl.setValue('12345');
    expect(passwordControl.errors?.['minlength']).toBeTruthy();
    passwordControl.setValue('123456');
    expect(passwordControl.errors?.['minlength']).toBeFalsy();
  });

  it('should show field errors when touched', () => {
    const usernameField = component.loginForm.get('usernameOrEmail');
    expect(usernameField).toBeTruthy();
    if (!usernameField) return;
    expect(component.isFieldInvalid('usernameOrEmail')).toBeFalse();
    usernameField.markAsTouched();
    expect(component.isFieldInvalid('usernameOrEmail')).toBeTrue();
    usernameField.setValue('testuser');
    expect(component.isFieldInvalid('usernameOrEmail')).toBeFalse();
  });

  it('should show appropriate error messages', () => {
    const usernameField = component.loginForm.get('usernameOrEmail');
    expect(usernameField).toBeTruthy();
    if (!usernameField) return;
    usernameField.markAsTouched();
    expect(component.getErrorMessage('usernameOrEmail')).toContain('required');
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl).toBeTruthy();
    if (!passwordControl) return;
    passwordControl.setValue('12345');
    passwordControl.markAsTouched();
    expect(component.getErrorMessage('password')).toContain('6 characters');
  });

  describe('Form Submission', () => {
    const validCredentials = {
      usernameOrEmail: 'testuser',
      password: 'password123'
    };

    it('should call auth service and navigate on successful login', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate');
      component.loginForm.setValue(validCredentials);
      component.onSubmit();
      tick();
      expect(component.isLoading).toBeTrue();
      expect(authServiceSpy.login).toHaveBeenCalledWith(validCredentials);
      expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle login error', fakeAsync(() => {
      const errorMessage = 'Invalid credentials';
      authServiceSpy.login.and.returnValue(throwError(() => ({ error: errorMessage })));
      component.loginForm.setValue(validCredentials);
      component.onSubmit();
      tick();
      expect(component.loginError).toBe(errorMessage);
      expect(component.isLoading).toBeFalse();
    }));

    it('should mark fields as touched on invalid submit', () => {
      component.onSubmit();
      expect(component.loginForm.get('usernameOrEmail')?.touched).toBeTrue();
      expect(component.loginForm.get('password')?.touched).toBeTrue();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });
  });
});
