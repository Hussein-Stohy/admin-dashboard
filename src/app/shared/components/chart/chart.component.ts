import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    borderDash?: number[];
    tension?: number;
  }[];
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'line';
  @Input() data!: ChartData;
  @Input() options: any = {};
  @Input() height = 300;

  private chart: Chart | null = null;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            color: 'rgb(75, 85, 99)' // gray-600
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgb(59, 130, 246)', // blue-500
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true
        }
      },
      scales: this.getScalesConfig()
    };

    const config: ChartConfiguration = {
      type: this.type,
      data: this.data,
      options: {
        ...defaultOptions,
        ...this.options
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private getScalesConfig(): any {
    if (this.type === 'doughnut' || this.type === 'pie') {
      return {};
    }

    return {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgb(107, 114, 128)' // gray-500
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(107, 114, 128)' // gray-500
        }
      }
    };
  }

  updateData(newData: ChartData): void {
    if (this.chart) {
      this.chart.data = newData;
      this.chart.update();
    }
  }

  updateOptions(newOptions: any): void {
    if (this.chart) {
      this.chart.options = { ...this.chart.options, ...newOptions };
      this.chart.update();
    }
  }
}