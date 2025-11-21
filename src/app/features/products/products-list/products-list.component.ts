import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../products.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent
  ],
  templateUrl: './products-list.component.html'
  ,
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  pageSize = 10;

  filteredProductsCount = computed(() => this.productsService.filteredProducts().length);

  constructor(public productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getProducts();
  }

  onSearchChange(term: string): void {
    this.productsService.setSearchTerm(term);
  }

  onCategoryChange(category: string): void {
    this.productsService.setSelectedCategory(category);
  }

  onPageSizeChange(size: string): void {
    this.productsService.setPageSize(parseInt(size));
  }

  goToPage(page: number): void {
    this.productsService.setCurrentPage(page);
  }

  viewProduct(id: string): void {
    // Navigation is handled by routerLink, this is for potential analytics
  }

  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      await this.productsService.deleteProduct(product.id);
    }
  }

  getStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'inactive':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
      case 'discontinued':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  }

  getStartIndex(): number {
    return (this.productsService.currentPage() - 1) * this.productsService.pageSize() + 1;
  }

  getEndIndex(): number {
    const end = this.productsService.currentPage() * this.productsService.pageSize();
    return Math.min(end, this.filteredProductsCount());
  }

  getVisiblePages(): number[] {
    const current = this.productsService.currentPage();
    const total = this.productsService.totalPages();
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
        visible.push(-1); // Ellipsis
        visible.push(total);
      } else if (current >= total - 3) {
        visible.push(1);
        visible.push(-1); // Ellipsis
        for (let i = total - 4; i <= total; i++) {
          visible.push(i);
        }
      } else {
        visible.push(1);
        visible.push(-1); // Ellipsis
        for (let i = current - 1; i <= current + 1; i++) {
          visible.push(i);
        }
        visible.push(-1); // Ellipsis
        visible.push(total);
      }
    }

    return visible.filter(page => page > 0);
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  exportProducts(): void {
    console.log('Exporting products...');
    // In a real app, this would export products to CSV/Excel
  }

  bulkEdit(): void {
    console.log('Opening bulk edit...');
    // In a real app, this would open a modal for bulk product editing
  }
}