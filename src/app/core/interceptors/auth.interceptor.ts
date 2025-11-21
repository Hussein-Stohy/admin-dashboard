import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.user();
    
    // Don't add auth header for login requests or public endpoints
    if (this.shouldSkipAuth(req)) {
      return next.handle(req);
    }

    // Add authorization header if user is logged in
    if (user) {
      // In a real app, get token from localStorage or service
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        return next.handle(authReq);
      }
    }

    return next.handle(req);
  }

  private shouldSkipAuth(req: HttpRequest<any>): boolean {
    const skipUrls = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];

    return skipUrls.some(url => req.url.includes(url));
  }
}