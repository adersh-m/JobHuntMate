import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    authServiceSpy.login.and.returnValue(of({ token: 'test-token', user: { id: '1', name: 'Test User', email: 'test@example.com' } }));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['email'].setValue('test@example.com');
    form.controls['password'].setValue('password');
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should call auth service on form submit', () => {
    const testCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    component.loginForm.setValue(testCredentials);
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith(testCredentials);
  });
});
