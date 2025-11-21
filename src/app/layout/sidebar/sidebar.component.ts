import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionsService } from '../../core/services/permissions.service';

interface NavigationItem {
  label: string;
  route: string;
  badge?: number;
  permission?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly collapsed = signal(false);
  
  readonly isCollapsed = this.collapsed.asReadonly();

  readonly sidebarClasses = computed(() => {
    const baseClasses = 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col h-full fixed left-0 top-0 z-40';
    const widthClasses = this.isCollapsed() ? 'w-16' : 'w-64';
    return `${baseClasses} ${widthClasses}`;
  });

  private readonly allNavigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      permission: 'dashboard.view'
    },
    {
      label: 'Analytics',
      route: '/analytics',
      permission: 'analytics.view'
    },
    {
      label: 'Products',
      route: '/products',
      permission: 'products.view'
    },
    {
      label: 'Categories',
      route: '/categories',
      permission: 'categories.view'
    },
    {
      label: 'Orders',
      route: '/orders',
      permission: 'orders.view'
    },
    {
      label: 'Users',
      route: '/users',
      badge: 12,
      permission: 'users.view'
    },
    {
      label: 'Settings',
      route: '/settings',
      permission: 'settings.view'
    }
  ];

  readonly navigationItems = computed(() => {
    // For demo purposes, show all items regardless of permissions
    // In production, uncomment the permission check below
    return this.allNavigationItems;
    
    // Production code with permission checking:
    // return this.allNavigationItems.filter(item => {
    //   if (!item.permission) return true;
    //   return this.permissionsService.hasPermission(item.permission);
    // });
  });

  constructor(private permissionsService: PermissionsService) {}

  toggleSidebar(): void {
    this.collapsed.update(value => !value);
    
    // Update main content margin
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (this.collapsed()) {
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-16');
      } else {
        mainContent.classList.remove('ml-16');
        mainContent.classList.add('ml-64');
      }
    }
  }

  getLinkClasses(): string {
    const baseClasses = 'sidebar-link group flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors duration-200';
    const collapsedClasses = this.isCollapsed() ? 'justify-center' : '';
    return `${baseClasses} ${collapsedClasses}`;
  }

  getUserSectionClasses(): string {
    const baseClasses = 'flex items-center';
    const collapsedClasses = this.isCollapsed() ? 'justify-center' : '';
    return `${baseClasses} ${collapsedClasses}`;
  }
}