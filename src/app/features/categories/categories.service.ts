import { Injectable, signal, computed } from '@angular/core';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoriesSignal = signal<Category[]>([]);
  private loadingSignal = signal(false);
  private searchTermSignal = signal('');
  private currentPageSignal = signal(1);
  private pageSizeSignal = signal(12);

  categories = this.categoriesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  searchTerm = this.searchTermSignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();
  pageSize = this.pageSizeSignal.asReadonly();

  filteredCategories = computed(() => {
    let filtered = this.categories();
    
    if (this.searchTerm()) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        category.description.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    return filtered;
  });

  paginatedCategories = computed(() => {
    const filtered = this.filteredCategories();
    const start = (this.currentPage() - 1) * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredCategories().length / this.pageSize())
  );

  activeCategories = computed(() => 
    this.categories().filter(c => c.status === 'active')
  );

  constructor() {
    this.generateMockCategories();
  }

  private generateMockCategories(): void {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices, gadgets, and accessories',
        color: '#3B82F6',
        icon: '📱',
        status: 'active',
        productCount: 45,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '2',
        name: 'Home & Kitchen',
        description: 'Kitchen appliances, cookware, and home essentials',
        color: '#EF4444',
        icon: '🏠',
        status: 'active',
        productCount: 32,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '3',
        name: 'Sports & Outdoors',
        description: 'Sporting goods, fitness equipment, and outdoor gear',
        color: '#10B981',
        icon: '⚽',
        status: 'active',
        productCount: 28,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: '4',
        name: 'Clothing',
        description: 'Fashion, apparel, shoes, and accessories',
        color: '#F59E0B',
        icon: '👕',
        status: 'active',
        productCount: 67,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: '5',
        name: 'Books',
        description: 'Books, e-books, magazines, and educational materials',
        color: '#8B5CF6',
        icon: '📚',
        status: 'active',
        productCount: 156,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: '6',
        name: 'Beauty & Personal Care',
        description: 'Cosmetics, skincare, personal hygiene products',
        color: '#EC4899',
        icon: '💄',
        status: 'active',
        productCount: 89,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-21')
      },
      {
        id: '7',
        name: 'Toys & Games',
        description: 'Toys, board games, video games, and entertainment',
        color: '#F97316',
        icon: '🎮',
        status: 'active',
        productCount: 34,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-23')
      },
      {
        id: '8',
        name: 'Automotive',
        description: 'Car parts, accessories, and automotive tools',
        color: '#6B7280',
        icon: '🚗',
        status: 'active',
        productCount: 23,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-24')
      },
      {
        id: '9',
        name: 'Home & Garden',
        description: 'Garden tools, plants, home decoration items',
        color: '#059669',
        icon: '🌱',
        status: 'active',
        productCount: 41,
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-26')
      },
      {
        id: '10',
        name: 'Bags & Luggage',
        description: 'Backpacks, travel bags, handbags, and luggage',
        color: '#DC2626',
        icon: '🎒',
        status: 'active',
        productCount: 19,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-27')
      }
    ];

    this.categoriesSignal.set(mockCategories);
  }

  async getCategories(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categories().find(c => c.id === id) || null;
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.categoriesSignal.update(categories => [...categories, newCategory]);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categoryIndex = this.categories().findIndex(c => c.id === id);
    if (categoryIndex === -1) return null;

    const updatedCategory = {
      ...this.categories()[categoryIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.categoriesSignal.update(categories => 
      categories.map(c => c.id === id ? updatedCategory : c)
    );

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categoryExists = this.categories().some(c => c.id === id);
    if (!categoryExists) return false;

    this.categoriesSignal.update(categories => categories.filter(c => c.id !== id));
    return true;
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
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