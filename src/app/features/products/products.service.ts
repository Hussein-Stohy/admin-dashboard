import { Injectable, signal, computed } from '@angular/core';
import { MockApiService } from '../../core/services/mock-api.service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);
  private searchTermSignal = signal('');
  private selectedCategorySignal = signal('');
  private currentPageSignal = signal(1);
  private pageSizeSignal = signal(10);

  products = this.productsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  searchTerm = this.searchTermSignal.asReadonly();
  selectedCategory = this.selectedCategorySignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();
  pageSize = this.pageSizeSignal.asReadonly();

  filteredProducts = computed(() => {
    let filtered = this.products();
    
    if (this.searchTerm()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    if (this.selectedCategory()) {
      filtered = filtered.filter(product => product.category === this.selectedCategory());
    }
    
    return filtered;
  });

  paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredProducts().length / this.pageSize())
  );

  categories = computed(() => 
    [...new Set(this.products().map(p => p.category))].sort()
  );

  constructor(private mockApiService: MockApiService) {
    this.generateMockProducts();
  }

  private generateMockProducts(): void {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        stock: 45,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Headphones',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 299.99,
        category: 'Electronics',
        stock: 23,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Smart+Watch',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker with programmable timer',
        price: 89.99,
        category: 'Home & Kitchen',
        stock: 67,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Coffee+Maker',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: '4',
        name: 'Running Shoes',
        description: 'Comfortable running shoes with advanced cushioning',
        price: 129.99,
        category: 'Sports & Outdoors',
        stock: 89,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Running+Shoes',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: '5',
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and USB charging',
        price: 49.99,
        category: 'Home & Garden',
        stock: 12,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Desk+Lamp',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: '6',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 39.99,
        category: 'Electronics',
        stock: 156,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Wireless+Mouse',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-21')
      },
      {
        id: '7',
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with extra cushioning',
        price: 24.99,
        category: 'Sports & Outdoors',
        stock: 78,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Yoga+Mat',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-23')
      },
      {
        id: '8',
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360-degree sound',
        price: 79.99,
        category: 'Electronics',
        stock: 34,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-24')
      },
      {
        id: '9',
        name: 'Backpack',
        description: 'Durable laptop backpack with multiple compartments',
        price: 59.99,
        category: 'Bags & Luggage',
        stock: 45,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Backpack',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-26')
      },
      {
        id: '10',
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle',
        price: 19.99,
        category: 'Sports & Outdoors',
        stock: 123,
        status: 'active',
        imageUrl: 'https://via.placeholder.com/300x200?text=Water+Bottle',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-27')
      }
    ];

    this.productsSignal.set(mockProducts);
  }

  async getProducts(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      // Products are already generated in constructor
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products().find(p => p.id === id) || null;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.productsSignal.update(products => [...products, newProduct]);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const productIndex = this.products().findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    const updatedProduct = {
      ...this.products()[productIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.productsSignal.update(products => 
      products.map(p => p.id === id ? updatedProduct : p)
    );

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const productExists = this.products().some(p => p.id === id);
    if (!productExists) return false;

    this.productsSignal.update(products => products.filter(p => p.id !== id));
    return true;
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
    this.currentPageSignal.set(1); // Reset to first page when searching
  }

  setSelectedCategory(category: string): void {
    this.selectedCategorySignal.set(category);
    this.currentPageSignal.set(1); // Reset to first page when filtering
  }

  setCurrentPage(page: number): void {
    this.currentPageSignal.set(page);
  }

  setPageSize(size: number): void {
    this.pageSizeSignal.set(size);
    this.currentPageSignal.set(1); // Reset to first page when changing page size
  }
}