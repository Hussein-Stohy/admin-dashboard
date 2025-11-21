import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService, Order } from '../orders.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent
  ],
    templateUrl: './order-details.component.html'

})
export class OrderDetailsComponent implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(false);

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  private async loadOrder(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const order = await this.ordersService.getOrderById(id);
      this.order.set(order);
    } finally {
      this.loading.set(false);
    }
  }

  async updateOrderStatus(newStatus: Order['status']): Promise<void> {
    const order = this.order();
    if (!order) return;

    if (confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      const updatedOrder = await this.ordersService.updateOrderStatus(order.id, newStatus);
      if (updatedOrder) {
        this.order.set(updatedOrder);
      }
    }
  }

  async updatePaymentStatus(newStatus: Order['paymentStatus']): Promise<void> {
    const order = this.order();
    if (!order) return;

    if (confirm(`Are you sure you want to mark payment as ${newStatus}?`)) {
      const updatedOrder = await this.ordersService.updatePaymentStatus(order.id, newStatus);
      if (updatedOrder) {
        this.order.set(updatedOrder);
      }
    }
  }

  printOrder(): void {
    // In a real app, this would generate and print an invoice
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/orders']);
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
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-lg';
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
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-lg';
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
}