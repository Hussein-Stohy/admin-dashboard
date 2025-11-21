import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request - Please check your input';
              break;
            case 401:
              errorMessage = 'Unauthorized - Please login again';
              this.handleUnauthorized();
              break;
            case 403:
              errorMessage = 'Forbidden - You don\'t have permission to access this resource';
              this.router.navigate(['/403']);
              break;
            case 404:
              errorMessage = 'Not Found - The requested resource was not found';
              break;
            case 422:
              errorMessage = 'Validation Error - Please check your input';
              if (error.error?.errors) {
                const validationErrors = Object.values(error.error.errors).flat();
                errorMessage = validationErrors.join(', ');
              }
              break;
            case 500:
              errorMessage = 'Internal Server Error - Please try again later';
              break;
            case 503:
              errorMessage = 'Service Unavailable - Server is temporarily down';
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              }
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: req.url,
          error: error.error
        });

        // You can add a global notification service here to show error messages
        // this.notificationService.showError(errorMessage);

        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }

  private handleUnauthorized(): void {
    // Clear user data and redirect to login
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}