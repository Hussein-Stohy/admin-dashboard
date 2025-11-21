import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ChartComponent, ChartData } from '../../shared/components/chart/chart.component';
import { ChartsDataService } from './charts-data.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, ChartComponent],
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {
  filterForm: FormGroup;

  // Mock data for key metrics
  totalRevenue = 234567;
  totalOrders = 1456;
  activeUsers = 3421;
  conversionRate = 24.5;

  // Chart data
  revenueChartData!: ChartData;
  userGrowthChartData!: ChartData;
  ordersStatusChartData!: ChartData;
  productCategoriesChartData!: ChartData;
  monthlySalesChartData!: ChartData;
  topProductsChartData!: ChartData;

  // Chart options
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  horizontalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  constructor(private fb: FormBuilder, private chartsDataService: ChartsDataService) {
    this.filterForm = this.fb.group({
      period: ['30d']
    });
  }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.revenueChartData = this.chartsDataService.getRevenueChartData();
    this.userGrowthChartData = this.chartsDataService.getUserGrowthChartData();
    this.ordersStatusChartData = this.chartsDataService.getOrdersStatusChartData();
    this.productCategoriesChartData = this.chartsDataService.getProductCategoriesChartData();
    this.monthlySalesChartData = this.chartsDataService.getMonthlySalesChartData();
    this.topProductsChartData = this.chartsDataService.getTopProductsChartData();
  }

  refreshData(): void {
    this.loadChartData();
    console.log('Charts data refreshed!');
  }
}