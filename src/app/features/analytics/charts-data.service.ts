import { Injectable } from '@angular/core';
import { ChartData } from '../../shared/components/chart/chart.component';

@Injectable({
  providedIn: 'root'
})
export class ChartsDataService {

  getRevenueChartData(): ChartData {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue 2024',
          data: [65000, 59000, 80000, 81000, 76000, 85000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          borderWidth: 3
        },
        {
          label: 'Revenue 2023',
          data: [45000, 49000, 60000, 71000, 66000, 75000],
          borderColor: 'rgb(156, 163, 175)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          fill: false,
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    };
  }

  getUserGrowthChartData(): ChartData {
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [
        {
          label: 'New Users',
          data: [12, 19, 15, 25, 22, 30, 28, 35],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderWidth: 2
        },
        {
          label: 'Active Users',
          data: [150, 165, 145, 185, 172, 200, 188, 215],
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderWidth: 2
        }
      ]
    };
  }

  getOrdersStatusChartData(): ChartData {
    return {
      labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      datasets: [
        {
          data: [15, 25, 30, 200, 10],
          backgroundColor: [
            'rgba(251, 191, 36, 0.8)',   // yellow - pending
            'rgba(59, 130, 246, 0.8)',   // blue - processing
            'rgba(139, 92, 246, 0.8)',   // purple - shipped
            'rgba(16, 185, 129, 0.8)',   // green - delivered
            'rgba(239, 68, 68, 0.8)'     // red - cancelled
          ],
          borderColor: [
            'rgb(251, 191, 36)',
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
            'rgb(16, 185, 129)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }
      ]
    };
  }

  getProductCategoriesChartData(): ChartData {
    return {
      labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Others'],
      datasets: [
        {
          label: 'Products',
          data: [45, 32, 28, 67, 41, 23],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)'
          ],
          borderWidth: 2
        }
      ]
    };
  }

  getMonthlySalesChartData(): ChartData {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Sales',
          data: [
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000,
            Math.floor(Math.random() * 50000) + 10000
          ],
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          borderWidth: 3,
          tension: 0.4
        }
      ]
    };
  }

  getTopProductsChartData(): ChartData {
    return {
      labels: ['Headphones', 'Smart Watch', 'Coffee Maker', 'Running Shoes', 'Desk Lamp'],
      datasets: [
        {
          label: 'Units Sold',
          data: [156, 142, 98, 87, 65],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2
        }
      ]
    };
  }
}