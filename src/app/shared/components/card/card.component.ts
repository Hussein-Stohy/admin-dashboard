import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() padding = true;
  @Input() noBorder = false;
  @Input() hasFooter = false;

  get cardClasses(): string {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm';
    const borderClasses = this.noBorder ? '' : 'border border-gray-200 dark:border-gray-700';
    
    return `${baseClasses} ${borderClasses}`;
  }

  get contentClasses(): string {
    if (!this.padding) return '';
    
    const paddingClass = this.title || this.subtitle ? 'px-6 py-4' : 'p-6';
    return paddingClass;
  }
}