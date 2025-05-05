import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    authServiceSpy.register.and.returnValue(of({ token: 'test-token', user: { id: '1', name: 'Test User', email: 'test@example.com' } }));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(form.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword'
    });
    expect(form.hasError('mismatch')).toBeTruthy();
    
    form.patchValue({
      confirmPassword: 'password123'
    });
    expect(form.hasError('mismatch')).toBeFalsy();
  });

  it('should validate password length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('short');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    
    passwordControl?.setValue('longenoughpassword');
    expect(passwordControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should call auth service on form submit', () => {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    component.registerForm.setValue(testData);
    component.onSubmit();
    
    const { confirmPassword, ...registrationData } = testData;
    expect(authServiceSpy.register).toHaveBeenCalledWith(registrationData);
  });
});
