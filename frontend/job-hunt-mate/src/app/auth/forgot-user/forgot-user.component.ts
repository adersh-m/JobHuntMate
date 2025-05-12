import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-user.component.html',
  styleUrls: ['./forgot-user.component.scss']
})
export class ForgotUserComponent {
  forgotUserForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.forgotUserForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.forgotUserForm.get(field);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) return 'Email is required';
    if (control.errors['email']) return 'Please enter a valid email address';
    return '';
  }

  onSubmit() {
    if (this.forgotUserForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Show notification or navigate
      }, 1500);
    } else {
      this.forgotUserForm.markAllAsTouched();
    }
  }
}
