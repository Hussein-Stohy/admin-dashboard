import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent
  ],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(false);

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  private async loadProduct(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const product = await this.productsService.getProductById(id);
      this.product.set(product);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduct(): Promise<void> {
    const product = this.product();
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      await this.productsService.deleteProduct(product.id);
      this.router.navigate(['/products']);
    }
  }

  async duplicateProduct(): Promise<void> {
    const product = this.product();
    if (!product) return;

    const duplicate = {
      ...product,
      name: `${product.name} (Copy)`
    };

    // Remove id, createdAt, updatedAt as they will be auto-generated
    const { id, createdAt, updatedAt, ...productData } = duplicate;

    await this.productsService.createProduct(productData);
    this.router.navigate(['/products']);
  }

  async toggleStatus(): Promise<void> {
    const product = this.product();
    if (!product) return;

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const updatedProduct = await this.productsService.updateProduct(product.id, { status: newStatus });

    if (updatedProduct) {
      this.product.set(updatedProduct);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
  }

  getStatusClasses(status: string): string {
    const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full';
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

  getStockClasses(stock: number): string {
    if (stock === 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (stock < 20) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  }
}