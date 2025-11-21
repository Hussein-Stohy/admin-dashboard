import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, FormFieldComponent],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly currentUser = this.authService.getCurrentUser();
  readonly currentTheme = this.themeService.getCurrentTheme();

  activeTab = 'profile';
  saving = false;
  changing = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  notificationSettings = {
    email: true,
    push: false,
    reports: true
  };

  activeSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: '3',
      device: 'Chrome on Mac',
      location: 'San Francisco, CA',
      lastActive: '3 days ago',
      current: false
    }
  ];

  settingsTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>'
    },
    {
      id: 'security',
      label: 'Security',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    },
    {
      id: 'account',
      label: 'Account',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['John', [Validators.required]],
      lastName: ['Doe', [Validators.required]],
      email: ['john.doe@example.com', [Validators.required, Validators.email]],
      jobTitle: ['Administrator'],
      bio: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Set form values from current user
    const user = this.currentUser();
    if (user) {
      const nameParts = user.name.split(' ');
      this.profileForm.patchValue({
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        email: user.email
      });
    }
  }

  getTabClasses(tabId: string): string {
    const baseClasses = 'flex items-center w-full px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors';
    const activeClasses = 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400';
    const inactiveClasses = 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';

    return `${baseClasses} ${this.activeTab === tabId ? activeClasses : inactiveClasses}`;
  }

  getToggleClasses(enabled: boolean): string {
    const baseClasses = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    return `${baseClasses} ${enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`;
  }

  getToggleButtonClasses(enabled: boolean): string {
    const baseClasses = 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform';
    return `${baseClasses} ${enabled ? 'translate-x-6' : 'translate-x-1'}`;
  }

  getFieldError(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
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

  sanitizeIcon(iconHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.valid) {
      this.saving = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Profile saved:', this.profileForm.value);
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        this.saving = false;
      }
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        this.passwordForm.get('confirmPassword')?.setErrors({ mismatch: true });
        return;
      }

      this.changing = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Password changed');
        this.passwordForm.reset();
      } catch (error) {
        console.error('Error changing password:', error);
      } finally {
        this.changing = false;
      }
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleNotification(type: keyof typeof this.notificationSettings): void {
    this.notificationSettings[type] = !this.notificationSettings[type];
  }

  terminateSession(sessionId: string): void {
    this.activeSessions = this.activeSessions.filter(session => session.id !== sessionId);
  }
}