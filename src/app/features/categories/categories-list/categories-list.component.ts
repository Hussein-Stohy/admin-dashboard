import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../categories.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  searchTerm = '';
  pageSize = 12;

  filteredCategoriesCount = computed(() => this.categoriesService.filteredCategories().length);

  constructor(public categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories();
  }

  onSearchChange(term: string): void {
    this.categoriesService.setSearchTerm(term);
  }

  onPageSizeChange(size: string): void {
    this.categoriesService.setPageSize(parseInt(size));
  }

  goToPage(page: number): void {
    this.categoriesService.setCurrentPage(page);
  }

  editCategory(id: string): void {
    // Navigation handled by click
  }

  async deleteCategory(category: Category): Promise<void> {
    if (confirm(`Are you sure you want to delete "${category.name}"? This will affect ${category.productCount} products.`)) {
      await this.categoriesService.deleteCategory(category.id);
    }
  }

  getStatusClasses(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
    }
  }

  getStartIndex(): number {
    return (this.categoriesService.currentPage() - 1) * this.categoriesService.pageSize() + 1;
  }

  getEndIndex(): number {
    const end = this.categoriesService.currentPage() * this.categoriesService.pageSize();
    return Math.min(end, this.filteredCategoriesCount());
  }

  getVisiblePages(): number[] {
    const current = this.categoriesService.currentPage();
    const total = this.categoriesService.totalPages();
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

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  exportCategories(): void {
    console.log('Exporting categories...');
    // In a real app, this would export categories to CSV/Excel
  }
}