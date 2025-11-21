import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.getCurrentUser();
  readonly currentTheme = this.themeService.getCurrentTheme();

  private readonly userMenuOpen = signal(false);
  readonly showUserMenu = this.userMenuOpen.asReadonly();

  readonly isDarkMode = computed(() => this.currentTheme() === 'dark');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close user menu when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.userMenuOpen.set(false);
    }
  }

  getPageTitle(): string {
    const url = this.router.url;
    switch (true) {
      case url.includes('dashboard'):
        return 'Dashboard';
      case url.includes('users'):
        return 'Users Management';
      case url.includes('analytics'):
        return 'Analytics';
      case url.includes('settings'):
        return 'Settings';
      default:
        return 'Admin Panel';
    }
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'JD';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(value => !value);
  }

  toggleNotifications(): void {
    console.log('Notifications clicked!');
    alert('Notifications panel would open here!');
  }

  goToProfile(): void {
    this.userMenuOpen.set(false);
    console.log('Navigating to profile...');
    this.router.navigate(['/settings']);
  }

  goToSettings(): void {
    this.userMenuOpen.set(false);
    console.log('Navigating to settings...');
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    console.log('Logging out...');
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}