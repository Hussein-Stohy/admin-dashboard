import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private permissionsService = inject(PermissionsService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkPermissions(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkPermissions(route, state);
  }

  private checkPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.currentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data?.['roles'] as string[];
    const requiredPermissions = route.data?.['permissions'] as string[];

    // If no specific roles or permissions required, allow access
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    // Check roles
    if (requiredRoles && !this.permissionsService.hasAnyRole(requiredRoles)) {
      this.router.navigate(['/403']);
      return false;
    }

    // Check permissions
    if (requiredPermissions && !this.permissionsService.hasAnyPermission(requiredPermissions)) {
      this.router.navigate(['/403']);
      return false;
    }

    return true;
  }
}