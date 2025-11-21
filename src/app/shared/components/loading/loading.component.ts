import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html'
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'skeleton' | 'dots' = 'spinner';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text?: string;
  @Input() fullScreen = false;
  @Input() skeletonLines = 3;

  get containerClasses(): string {
    const baseClasses = 'flex flex-col items-center justify-center';
    const sizeClasses = this.fullScreen 
      ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50'
      : 'py-8';
    
    return `${baseClasses} ${sizeClasses}`;
  }

  get spinnerClasses(): string {
    const baseClasses = 'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600';
    
    const sizeClasses = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8', 
      lg: 'h-12 w-12'
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  getSkeletonLineClasses(lineIndex: number): string {
    const baseClasses = 'bg-gray-300 dark:bg-gray-700 rounded';
    const heights = ['h-4', 'h-4', 'h-3'];
    const widths = ['w-full', 'w-5/6', 'w-4/6'];
    
    return `${baseClasses} ${heights[lineIndex % heights.length]} ${widths[lineIndex % widths.length]}`;
  }
}