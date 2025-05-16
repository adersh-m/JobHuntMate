// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { provideRouter } from '@angular/router';
// import { RegisterComponent } from './register.component';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';

// describe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let router: Router;

//   beforeEach(async () => {
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
//     authServiceSpy.register.and.returnValue(of({
//       token: 'test-token',
//       refreshToken: 'test-refresh-token',
//       user: { id: '1', name: 'Test User', email: 'test@example.com' }
//     }));

//     await TestBed.configureTestingModule({
//       imports: [RegisterComponent, ReactiveFormsModule],
//       providers: [
//         { provide: AuthService, useValue: authServiceSpy },
//         provideRouter([])
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize with empty form', () => {
//     expect(component.registerForm.get('username')?.value).toBe('');
//     expect(component.registerForm.get('email')?.value).toBe('');
//     expect(component.registerForm.get('password')?.value).toBe('');
//     expect(component.registerForm.get('confirmPassword')?.value).toBe('');
//     expect(component.isLoading).toBeFalse();
//     expect(component.registrationError).toBeNull();
//   });

//   describe('Form Validation', () => {
//     it('should validate required fields', () => {
//       const form = component.registerForm;
//       expect(form.valid).toBeFalsy();
//       const validData = {
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'password123',
//         confirmPassword: 'password123'
//       };
//       form.patchValue(validData);
//       expect(form.valid).toBeTruthy();
//     });

//     it('should validate username minimum length', () => {
//       const usernameField = component.registerForm.get('username');
//       expect(usernameField).toBeTruthy();
//       if (!usernameField) return;
//       usernameField.setValue('a');
//       expect(usernameField.errors?.['minlength']).toBeTruthy();
//       usernameField.setValue('validuser');
//       expect(usernameField.errors?.['minlength']).toBeFalsy();
//     });

//     it('should validate email format', () => {
//       const emailField = component.registerForm.get('email');
//       expect(emailField).toBeTruthy();
//       if (!emailField) return;
//       emailField.setValue('invalid-email');
//       expect(emailField.errors?.['email']).toBeTruthy();
//       emailField.setValue('valid@email.com');
//       expect(emailField.errors?.['email']).toBeFalsy();
//     });

//     it('should validate password minimum length', () => {
//       const passwordField = component.registerForm.get('password');
//       expect(passwordField).toBeTruthy();
//       if (!passwordField) return;
//       passwordField.setValue('1234567');
//       expect(passwordField.errors?.['minlength']).toBeTruthy();
//       passwordField.setValue('password123');
//       expect(passwordField.errors?.['minlength']).toBeFalsy();
//     });

//     it('should validate password match', () => {
//       const form = component.registerForm;
//       form.patchValue({
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'password123',
//         confirmPassword: 'different'
//       });
//       expect(form.hasError('mismatch')).toBeTrue();
//       form.patchValue({ confirmPassword: 'password123' });
//       expect(form.hasError('mismatch')).toBeFalse();
//     });
//   });

//   describe('Error Messages', () => {
//     it('should show appropriate field error messages', () => {
//       const emailField = component.registerForm.get('email');
//       expect(emailField).toBeTruthy();
//       if (!emailField) return;
//       emailField.setValue('invalid-email');
//       emailField.markAsTouched();
//       expect(component.getErrorMessage('email')).toContain('valid email');
//       const passwordField = component.registerForm.get('password');
//       expect(passwordField).toBeTruthy();
//       if (!passwordField) return;
//       passwordField.setValue('short');
//       passwordField.markAsTouched();
//       expect(component.getErrorMessage('password')).toContain('8 characters');
//     });

//     it('should show password mismatch error', () => {
//       const form = component.registerForm;
//       form.patchValue({
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'password123',
//         confirmPassword: 'different'
//       });
//       const confirmField = component.registerForm.get('confirmPassword');
//       expect(confirmField).toBeTruthy();
//       if (!confirmField) return;
//       confirmField.markAsTouched();
//       expect(component.getErrorMessage('confirmPassword')).toContain('do not match');
//     });
//   });

//   describe('Form Submission', () => {
//     const validData = {
//       username: 'testuser',
//       email: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123'
//     };

//     it('should call auth service and navigate on successful registration', fakeAsync(() => {
//       const navigateSpy = spyOn(router, 'navigate');
//       component.registerForm.setValue(validData);
//       component.onSubmit();
//       tick();
      
//       const registrationData = {
//         name: validData.username,
//         email: validData.email,
//         password: validData.password
//       };
//       expect(component.isLoading).toBeTrue();
//       expect(authServiceSpy.register).toHaveBeenCalledWith(registrationData);
//       expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
//     }));

//     it('should handle registration error', fakeAsync(() => {
//       const errorMessage = 'Email already exists';
//       authServiceSpy.register.and.returnValue(throwError(() => ({ message: errorMessage })));
//       component.registerForm.setValue(validData);
//       component.onSubmit();
//       tick();
//       expect(component.registrationError).toBe(errorMessage);
//       expect(component.isLoading).toBeFalse();
//     }));

//     it('should mark fields as touched on invalid submit', () => {
//       component.onSubmit();
//       expect(component.registerForm.get('username')?.touched).toBeTrue();
//       expect(component.registerForm.get('email')?.touched).toBeTrue();
//       expect(component.registerForm.get('password')?.touched).toBeTrue();
//       expect(component.registerForm.get('confirmPassword')?.touched).toBeTrue();
//       expect(authServiceSpy.register).not.toHaveBeenCalled();
//     });

//     it('should not submit if passwords do not match', () => {
//       const invalidData = { ...validData, confirmPassword: 'different' };
//       component.registerForm.setValue(invalidData);
//       component.onSubmit();
//       expect(authServiceSpy.register).not.toHaveBeenCalled();
//     });
//   });

//   describe('Field Invalid States', () => {
//     it('should correctly identify invalid fields', () => {
//       const emailField = component.registerForm.get('email');
//       expect(emailField).toBeTruthy();
//       if (!emailField) return;
//       expect(component.isFieldInvalid('email')).toBeFalse();
//       emailField.setValue('invalid-email');
//       emailField.markAsTouched();
//       expect(component.isFieldInvalid('email')).toBeTrue();
//       emailField.setValue('valid@email.com');
//       expect(component.isFieldInvalid('email')).toBeFalse();
//     });

//     it('should handle confirmPassword field invalid state', () => {
//       component.registerForm.patchValue({
//         password: 'password123',
//         confirmPassword: 'different'
//       });
//       const confirmField = component.registerForm.get('confirmPassword');
//       expect(confirmField).toBeTruthy();
//       if (!confirmField) return;
//       confirmField.markAsTouched();
//       expect(component.isFieldInvalid('confirmPassword')).toBeTrue();
//       component.registerForm.patchValue({ confirmPassword: 'password123' });
//       expect(component.isFieldInvalid('confirmPassword')).toBeFalse();
//     });
//   });
// });
