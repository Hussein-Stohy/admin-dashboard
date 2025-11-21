import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isLoggedIn = signal<boolean>(false);

  constructor(private router: Router) {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isLoggedIn.set(true);
    }
  }

  // Getters for signals
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsLoggedIn() {
    return this.isLoggedIn.asReadonly();
  }

  // Public access to user signal
  user() {
    return this.currentUser();
  }

  async login(email: string, password: string): Promise<boolean> {
    // Mock authentication - replace with real API call
    await this.delay(1000); // Simulate API call
    
    if (email === 'admin@example.com' && password === 'admin123') {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
      };
      
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}