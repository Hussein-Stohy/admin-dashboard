import { Component, OnInit, signal, computed, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ChartComponent, ChartData } from '../../shared/components/chart/chart.component';
import { MockApiService, DashboardStats, Activity } from '../../core/services/mock-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, LoadingComponent, ButtonComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly mockApiService = inject(MockApiService);

  @ViewChild('usersCanvas') usersCanvas!: ElementRef<HTMLCanvasElement>;

  public readonly loading = signal(true);
  public readonly stats = signal([
    { label: 'Total Users', value: '2,543', change: 12, type: 'users' as const },
    { label: 'Revenue', value: '$54,329', change: 23, type: 'revenue' as const },
    { label: 'Orders', value: '1,423', change: 8, type: 'orders' as const },
    { label: 'Growth', value: '18.2%', change: -2, type: 'growth' as const }
  ]);
  
  public readonly recentActivities = signal<Activity[]>([]);
  public readonly usersChart = signal<ChartData | null>(null);
  
  // Chart data for the dashboard
  public readonly salesChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        borderWidth: 2
      },
      {
        label: 'Target',
        data: [15000, 20000, 18000, 28000, 25000, 32000, 30000, 38000, 35000, 42000, 40000, 48000],
        borderColor: 'rgb(16, 185, 129)', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };

  public readonly salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  public readonly userActivityChartData: ChartData = {
    labels: ['New Users', 'Active Users', 'Returning Users', 'Inactive Users'],
    datasets: [
      {
        label: 'User Distribution',
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(16, 185, 129, 0.8)',   // emerald
          'rgba(245, 158, 11, 0.8)',   // amber
          'rgba(239, 68, 68, 0.8)'     // red
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  public readonly userActivityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };
  
  readonly lastUpdated = new Date();
  readonly Math = Math;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized automatically by the chart component
  }

  private async loadDashboardData(): Promise<void> {
    try {
      // Load recent activities
      const activities = await this.mockApiService.getRecentActivities();
      this.recentActivities.set(activities);
      this.loading.set(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.loading.set(false);
    }
  }

  getChangeColorClasses(change: number): string {
    return change > 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  }

  getStatIconClasses(type: string): string {
    const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center';
    
    switch (type) {
      case 'users':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`;
      case 'revenue':
        return `${baseClasses} bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400`;
      case 'orders':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400`;
      case 'growth':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`;
    }
  }

  getActivityIconClasses(type: string): string {
    const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';
    
    switch (type) {
      case 'user_login':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`;
      case 'user_created':
        return `${baseClasses} bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400`;
      case 'order_placed':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400`;
      case 'system_update':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`;
      default:
        return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`;
    }
  }

  refreshActivities(): void {
    this.loading.set(true);
    this.loadDashboardData();
  }

  quickAction(action: string): void {
    switch (action) {
      case 'add-user':
        this.router.navigate(['/users']);
        break;
      case 'view-analytics':
        this.router.navigate(['/analytics']);
        break;
      case 'export-data':
        console.log('Export data functionality would be implemented here');
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
    }
  }
}