import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlingService } from '../../core/services/error-handling.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private errorHandler: ErrorHandlingService) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.forgotForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    getErrorMessage(field: string): string {
        const control = this.forgotForm.get(field);
        if (!control || !control.errors || !control.touched) return '';
        if (control.errors['required']) return 'Email is required';
        if (control.errors['email']) return 'Please enter a valid email address';
        return '';
    }

    onSubmit() {
        if (this.forgotForm.valid) {
            this.isLoading = true;
            this.errorMessage = null;
            this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.isSuccess) {
                        sessionStorage.setItem('email-sent-allowed', '1');
                        this.router.navigate(['/email-sent'], { queryParams: { context: 'forgot' } });
                    } else {
                        this.errorMessage = response.message || 'Failed to send reset link. Please try again.';
                    }
                },
                error: (error) => {
                    this.errorMessage = this.errorHandler.handleError(error, { suppressToast: true });
                    this.isLoading = false;
                }
            });
        } else {
            this.forgotForm.markAllAsTouched();
        }
    }
}
