import { Injectable, signal } from '@angular/core';

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
  avatar?: string;
}

export interface Activity {
  id: string;
  type: 'user_login' | 'user_created' | 'order_placed' | 'system_update';
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly stats = signal<DashboardStats>({
    totalUsers: 1248,
    totalRevenue: 89247.50,
    totalOrders: 429,
    conversionRate: 3.24
  });

  private readonly users = signal<User[]>(this.generateMockUsers());
  private readonly activities = signal<Activity[]>(this.generateMockActivities());

  constructor() {}

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay(500);
    return this.stats();
  }

  async getRevenueChart(): Promise<ChartData> {
    await this.delay(300);
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }]
    };
  }

  async getUsersChart(): Promise<ChartData> {
    await this.delay(300);
    return {
      labels: ['Active', 'Inactive', 'Pending'],
      datasets: [{
        label: 'Users',
        data: [756, 324, 168],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ]
      }]
    };
  }

  async getTrafficChart(): Promise<ChartData> {
    await this.delay(300);
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Visitors',
        data: [2400, 1398, 3800, 3908, 4800, 3800, 4300],
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }]
    };
  }

  async getRecentActivities(): Promise<Activity[]> {
    await this.delay(400);
    return this.activities().slice(0, 10);
  }

  // Users methods
  async getUsers(page: number = 1, limit: number = 10, search?: string): Promise<{ users: User[], total: number }> {
    await this.delay(100);
    
    let filteredUsers = this.users();
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredUsers.length;
    const start = (page - 1) * limit;
    const users = filteredUsers.slice(start, start + limit);

    return { users, total };
  }

  async createUser(userData: Partial<User>): Promise<User> {
    await this.delay(200);
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'User',
      status: 'active',
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=3b82f6&color=fff`
    };

    this.users.update(users => [newUser, ...users]);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await this.delay(200);
    
    this.users.update(users => 
      users.map(user => 
        user.id === id ? { ...user, ...userData } : user
      )
    );

    const updatedUser = this.users().find(user => user.id === id);
    if (!updatedUser) throw new Error('User not found');
    
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay(100);
    this.users.update(users => users.filter(user => user.id !== id));
  }

  // Analytics methods
  async getAnalyticsData(): Promise<{
    pageViews: ChartData;
    conversionRates: ChartData;
    topPages: Array<{ page: string; views: number; rate: number }>;
  }> {
    await this.delay(600);
    
    return {
      pageViews: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Page Views',
          data: [45000, 52000, 48000, 61000, 58000, 67000],
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2
        }]
      },
      conversionRates: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          label: 'Conversion Rate (%)',
          data: [4.2, 3.8, 3.1],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ]
        }]
      },
      topPages: [
        { page: '/dashboard', views: 15420, rate: 4.2 },
        { page: '/products', views: 12380, rate: 3.8 },
        { page: '/users', views: 9240, rate: 3.1 },
        { page: '/analytics', views: 7160, rate: 2.9 },
        { page: '/settings', views: 5890, rate: 2.5 }
      ]
    };
  }

  private generateMockUsers(): User[] {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Lisa Davis', 'Chris Wilson', 'Emma Taylor', 'Alex Johnson', 'Maria Garcia'];
    const roles = ['Admin', 'User', 'Manager', 'Editor'];
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];

    return names.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      role: roles[index % roles.length],
      status: statuses[index % 2],
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 1000000000) : undefined,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`
    }));
  }

  private generateMockActivities(): Activity[] {
    const activities: Activity[] = [
      {
        id: '1',
        type: 'user_login',
        description: 'John Doe logged in',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'John Doe'
      },
      {
        id: '2',
        type: 'user_created',
        description: 'New user registered: Jane Smith',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'Jane Smith'
      },
      {
        id: '3',
        type: 'order_placed',
        description: 'Order #1234 was placed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { orderId: '1234', amount: 299.99 }
      },
      {
        id: '4',
        type: 'system_update',
        description: 'System backup completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '5',
        type: 'user_login',
        description: 'Sarah Williams logged in',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        user: 'Sarah Williams'
      }
    ];

    return activities;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}