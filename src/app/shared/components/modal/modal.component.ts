import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() maxWidth = '32rem';
  @Input() bodyMaxHeight = '24rem';
  @Input() hasFooter = false;
  @Input() closeOnBackdropClick = true;
  
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  handleBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }
}