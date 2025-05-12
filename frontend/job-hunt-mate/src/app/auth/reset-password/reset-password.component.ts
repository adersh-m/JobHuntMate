import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  showPassword = false;
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Get token and email from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  passwordMatchValidator(control: AbstractControl): { mismatch: true } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.resetForm.get(field);
    if (field === 'confirmPassword') {
      return (control?.invalid || this.resetForm.hasError('mismatch')) && (control?.dirty || control?.touched) || false;
    }
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.resetForm.get(field);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) return `${field === 'confirmPassword' ? 'Confirm password' : 'Password'} is required`;
    if (control.errors['minlength']) return 'Password must be at least 8 characters';
    if (field === 'confirmPassword' && this.resetForm.hasError('mismatch')) return 'Passwords do not match';
    return '';
  }

  onSubmit() {
    if (this.resetForm.valid && !this.resetForm.hasError('mismatch')) {
      this.isLoading = true;
      const { password } = this.resetForm.value;
      this.authService.resetPassword({ email: this.email, token: this.token, newPassword: password }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.notificationService.showError('Successfully reset password');
          this.isLoading = false;
        },
        error: (error) => {
          this.notificationService.showError('Failed to reset password');
          this.isLoading = false;
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
