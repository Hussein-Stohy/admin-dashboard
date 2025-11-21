import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly PERMISSIONS: Permission[] = [
    { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard' },
    { id: 'analytics.view', name: 'View Analytics', description: 'Access to analytics and reports' },
    
    // Products
    { id: 'products.view', name: 'View Products', description: 'View products list' },
    { id: 'products.create', name: 'Create Products', description: 'Add new products' },
    { id: 'products.edit', name: 'Edit Products', description: 'Modify existing products' },
    { id: 'products.delete', name: 'Delete Products', description: 'Remove products' },
    
    // Categories
    { id: 'categories.view', name: 'View Categories', description: 'View categories list' },
    { id: 'categories.create', name: 'Create Categories', description: 'Add new categories' },
    { id: 'categories.edit', name: 'Edit Categories', description: 'Modify existing categories' },
    { id: 'categories.delete', name: 'Delete Categories', description: 'Remove categories' },
    
    // Orders
    { id: 'orders.view', name: 'View Orders', description: 'View orders list' },
    { id: 'orders.edit', name: 'Edit Orders', description: 'Modify order status' },
    { id: 'orders.manage', name: 'Manage Orders', description: 'Full order management' },
    
    // Users
    { id: 'users.view', name: 'View Users', description: 'View users list' },
    { id: 'users.create', name: 'Create Users', description: 'Add new users' },
    { id: 'users.edit', name: 'Edit Users', description: 'Modify existing users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove users' },
    
    // Settings
    { id: 'settings.view', name: 'View Settings', description: 'Access settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings' }
  ];

  private readonly ROLE_PERMISSIONS: RolePermissions[] = [
    {
      role: 'admin',
      permissions: [
        'dashboard.view', 'analytics.view',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
        'orders.view', 'orders.edit', 'orders.manage',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'settings.view', 'settings.edit'
      ]
    },
    {
      role: 'manager',
      permissions: [
        'dashboard.view', 'analytics.view',
        'products.view', 'products.create', 'products.edit',
        'categories.view', 'categories.create', 'categories.edit',
        'orders.view', 'orders.edit', 'orders.manage',
        'users.view', 'users.edit',
        'settings.view'
      ]
    },
    {
      role: 'editor',
      permissions: [
        'dashboard.view',
        'products.view', 'products.create', 'products.edit',
        'categories.view', 'categories.create', 'categories.edit',
        'orders.view', 'orders.edit',
        'settings.view'
      ]
    },
    {
      role: 'viewer',
      permissions: [
        'dashboard.view',
        'products.view',
        'categories.view',
        'orders.view'
      ]
    }
  ];

  constructor(private authService: AuthService) {}

  getUserPermissions(): string[] {
    const user = this.authService.user();
    if (!user) return [];

    const rolePermissions = this.ROLE_PERMISSIONS.find(rp => rp.role === user.role);
    return rolePermissions?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    const userPermissions = this.getUserPermissions();
    return userPermissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return permissions.every(permission => userPermissions.includes(permission));
  }

  hasRole(role: UserRole): boolean {
    const user = this.authService.user();
    return user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.authService.user();
    return user ? roles.includes(user.role as UserRole) : false;
  }

  getPermissionsByRole(role: UserRole): string[] {
    const rolePermissions = this.ROLE_PERMISSIONS.find(rp => rp.role === role);
    return rolePermissions?.permissions || [];
  }

  getAllPermissions(): Permission[] {
    return this.PERMISSIONS;
  }

  getAllRoles(): UserRole[] {
    return ['admin', 'manager', 'editor', 'viewer'];
  }

  canAccess(requiredPermissions: string[], requiredRoles?: UserRole[]): boolean {
    // Check roles first if provided
    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.hasAnyRole(requiredRoles)) {
        return false;
      }
    }

    // Check permissions
    return this.hasAnyPermission(requiredPermissions);
  }

  getHighestRole(): UserRole | null {
    const user = this.authService.user();
    return user?.role as UserRole || null;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isManager(): boolean {
    return this.hasRole('manager') || this.isAdmin();
  }

  isEditor(): boolean {
    return this.hasRole('editor') || this.isManager();
  }

  canManageUsers(): boolean {
    return this.hasAnyPermission(['users.create', 'users.edit', 'users.delete']);
  }

  canManageProducts(): boolean {
    return this.hasAnyPermission(['products.create', 'products.edit', 'products.delete']);
  }

  canManageOrders(): boolean {
    return this.hasPermission('orders.manage');
  }

  canViewAnalytics(): boolean {
    return this.hasPermission('analytics.view');
  }
}