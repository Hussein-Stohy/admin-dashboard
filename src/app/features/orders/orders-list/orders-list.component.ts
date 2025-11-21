import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order } from '../orders.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent
  ],
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  paymentStatusFilter = '';
  pageSize = 10;
  showStatusDropdown: string | null = null;

  filteredOrdersCount = computed(() => this.ordersService.filteredOrders().length);

  constructor(public ordersService: OrdersService) { }

  ngOnInit(): void {
    this.ordersService.getOrders();
  }

  onSearchChange(term: string): void {
    this.ordersService.setSearchTerm(term);
  }

  onStatusFilterChange(status: string): void {
    this.ordersService.setStatusFilter(status);
  }

  onPaymentStatusFilterChange(status: string): void {
    this.ordersService.setPaymentStatusFilter(status);
  }

  onPageSizeChange(size: string): void {
    this.ordersService.setPageSize(parseInt(size));
  }

  goToPage(page: number): void {
    this.ordersService.setCurrentPage(page);
  }

  viewOrder(id: string): void {
    // Navigation handled by routerLink
  }

  toggleStatusDropdown(orderId: string): void {
    this.showStatusDropdown = this.showStatusDropdown === orderId ? null : orderId;
  }

  async updateOrderStatus(order: Order, newStatus: Order['status']): Promise<void> {
    await this.ordersService.updateOrderStatus(order.id, newStatus);
    this.showStatusDropdown = null;
  }

  getAvailableStatuses(currentStatus: Order['status']): Order['status'][] {
    const statusFlow: { [key: string]: Order['status'][] } = {
      'pending': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': [],
      'refunded': []
    };
    return statusFlow[currentStatus] || [];
  }

  getOrderStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
      case 'shipped':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'refunded':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  }

  getPaymentStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'refunded':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  }

  getPaymentMethodDisplay(method: string): string {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      default: return method;
    }
  }

  getStartIndex(): number {
    return (this.ordersService.currentPage() - 1) * this.ordersService.pageSize() + 1;
  }

  getEndIndex(): number {
    const end = this.ordersService.currentPage() * this.ordersService.pageSize();
    return Math.min(end, this.filteredOrdersCount());
  }

  getVisiblePages(): number[] {
    const current = this.ordersService.currentPage();
    const total = this.ordersService.totalPages();
    const visible: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        visible.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          visible.push(i);
        }
        visible.push(-1);
        visible.push(total);
      } else if (current >= total - 3) {
        visible.push(1);
        visible.push(-1);
        for (let i = total - 4; i <= total; i++) {
          visible.push(i);
        }
      } else {
        visible.push(1);
        visible.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          visible.push(i);
        }
        visible.push(-1);
        visible.push(total);
      }
    }

    return visible.filter(page => page > 0);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  exportOrders(): void {
    console.log('Exporting orders...');
    // In a real app, this would export orders to CSV/Excel
  }

  printOrders(): void {
    console.log('Printing orders...');
    window.print();
  }

  bulkActions(): void {
    console.log('Opening bulk actions menu...');
    // In a real app, this would open a modal for bulk operations
  }
}