import { Injectable, signal, computed } from '@angular/core';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersSignal = signal<Order[]>([]);
  private loadingSignal = signal(false);
  private searchTermSignal = signal('');
  private statusFilterSignal = signal('');
  private paymentStatusFilterSignal = signal('');
  private currentPageSignal = signal(1);
  private pageSizeSignal = signal(10);

  orders = this.ordersSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  searchTerm = this.searchTermSignal.asReadonly();
  statusFilter = this.statusFilterSignal.asReadonly();
  paymentStatusFilter = this.paymentStatusFilterSignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();
  pageSize = this.pageSizeSignal.asReadonly();

  filteredOrders = computed(() => {
    let filtered = this.orders();
    
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term)
      );
    }
    
    if (this.statusFilter()) {
      filtered = filtered.filter(order => order.status === this.statusFilter());
    }

    if (this.paymentStatusFilter()) {
      filtered = filtered.filter(order => order.paymentStatus === this.paymentStatusFilter());
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  paginatedOrders = computed(() => {
    const filtered = this.filteredOrders();
    const start = (this.currentPage() - 1) * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredOrders().length / this.pageSize())
  );

  orderStats = computed(() => {
    const orders = this.orders();
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
    };
  });

  constructor() {
    this.generateMockOrders();
  }

  private generateMockOrders(): void {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerId: '1',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Wireless Bluetooth Headphones',
            quantity: 1,
            price: 199.99,
            total: 199.99
          },
          {
            id: '2',
            productId: '6',
            productName: 'Wireless Mouse',
            quantity: 2,
            price: 39.99,
            total: 79.98
          }
        ],
        subtotal: 279.97,
        tax: 25.20,
        shipping: 9.99,
        discount: 0,
        total: 315.16,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        notes: 'Please handle with care',
        createdAt: new Date('2024-01-25T10:30:00'),
        updatedAt: new Date('2024-01-28T14:45:00')
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customerId: '2',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        items: [
          {
            id: '3',
            productId: '2',
            productName: 'Smart Watch',
            quantity: 1,
            price: 299.99,
            total: 299.99
          }
        ],
        subtotal: 299.99,
        tax: 27.00,
        shipping: 12.99,
        discount: 30.00,
        total: 309.98,
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        createdAt: new Date('2024-01-26T14:15:00'),
        updatedAt: new Date('2024-01-28T09:20:00')
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customerId: '3',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@example.com',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        items: [
          {
            id: '4',
            productId: '4',
            productName: 'Running Shoes',
            quantity: 1,
            price: 129.99,
            total: 129.99
          },
          {
            id: '5',
            productId: '7',
            productName: 'Yoga Mat',
            quantity: 1,
            price: 24.99,
            total: 24.99
          }
        ],
        subtotal: 154.98,
        tax: 13.95,
        shipping: 7.99,
        discount: 15.50,
        total: 161.42,
        shippingAddress: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        notes: 'Rush delivery requested',
        createdAt: new Date('2024-01-27T16:45:00'),
        updatedAt: new Date('2024-01-28T11:30:00')
      },
      {
        id: '4',
        orderNumber: 'ORD-2024-004',
        customerId: '4',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@example.com',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'credit_card',
        items: [
          {
            id: '6',
            productId: '3',
            productName: 'Coffee Maker',
            quantity: 1,
            price: 89.99,
            total: 89.99
          }
        ],
        subtotal: 89.99,
        tax: 8.10,
        shipping: 5.99,
        discount: 0,
        total: 104.08,
        shippingAddress: {
          street: '321 Elm St',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA'
        },
        createdAt: new Date('2024-01-28T09:15:00'),
        updatedAt: new Date('2024-01-28T09:15:00')
      },
      {
        id: '5',
        orderNumber: 'ORD-2024-005',
        customerId: '5',
        customerName: 'David Brown',
        customerEmail: 'david.brown@example.com',
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'bank_transfer',
        items: [
          {
            id: '7',
            productId: '8',
            productName: 'Bluetooth Speaker',
            quantity: 2,
            price: 79.99,
            total: 159.98
          }
        ],
        subtotal: 159.98,
        tax: 14.40,
        shipping: 8.99,
        discount: 0,
        total: 183.37,
        shippingAddress: {
          street: '654 Maple Dr',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        notes: 'Customer requested cancellation',
        createdAt: new Date('2024-01-24T12:00:00'),
        updatedAt: new Date('2024-01-26T15:30:00')
      }
    ];

    this.ordersSignal.set(mockOrders);
  }

  async getOrders(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders().find(o => o.id === id) || null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const orderIndex = this.orders().findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    const updatedOrder = {
      ...this.orders()[orderIndex],
      status,
      updatedAt: new Date()
    };

    this.ordersSignal.update(orders => 
      orders.map(o => o.id === id ? updatedOrder : o)
    );

    return updatedOrder;
  }

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> {
    const orderIndex = this.orders().findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    const updatedOrder = {
      ...this.orders()[orderIndex],
      paymentStatus,
      updatedAt: new Date()
    };

    this.ordersSignal.update(orders => 
      orders.map(o => o.id === id ? updatedOrder : o)
    );

    return updatedOrder;
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
    this.currentPageSignal.set(1);
  }

  setStatusFilter(status: string): void {
    this.statusFilterSignal.set(status);
    this.currentPageSignal.set(1);
  }

  setPaymentStatusFilter(status: string): void {
    this.paymentStatusFilterSignal.set(status);
    this.currentPageSignal.set(1);
  }

  setCurrentPage(page: number): void {
    this.currentPageSignal.set(page);
  }

  setPageSize(size: number): void {
    this.pageSizeSignal.set(size);
    this.currentPageSignal.set(1);
  }
}