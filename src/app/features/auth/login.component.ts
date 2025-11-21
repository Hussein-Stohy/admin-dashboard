import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  public readonly loading = signal(false);
  public readonly errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Getter methods for template
  getLoading() {
    return this.loading();
  }

  getErrorMessage() {
    return this.errorMessage();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `Password must be at least ${field.errors?.['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.loginForm.value;

      try {
        const success = await this.authService.login(email, password);
        
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Invalid email or password. Please try again.');
        }
      } catch (error) {
        this.errorMessage.set('An error occurred. Please try again.');
        console.error('Login error:', error);
      } finally {
        this.loading.set(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}