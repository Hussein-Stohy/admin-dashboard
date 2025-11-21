import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;
  productId: string | null = null;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.productId;

    if (this.isEditing && this.productId) {
      this.loadProduct();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['active', Validators.required],
      imageUrl: ['', Validators.pattern(/^https?:\/\/.+/)]
    });
  }

  private async loadProduct(): Promise<void> {
    if (!this.productId) return;

    this.loading.set(true);
    try {
      const product = await this.productsService.getProductById(this.productId);
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          status: product.status,
          imageUrl: product.imageUrl
        });
      } else {
        this.router.navigate(['/products']);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);
    try {
      const formValue = this.productForm.value;

      if (this.isEditing && this.productId) {
        await this.productsService.updateProduct(this.productId, formValue);
      } else {
        await this.productsService.createProduct(formValue);
      }

      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error saving product:', error);
      // In a real app, show a toast or error message
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduct(): Promise<void> {
    if (!this.productId) return;

    const productName = this.productForm.get('name')?.value;
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    this.loading.set(true);
    try {
      await this.productsService.deleteProduct(this.productId);
      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  }

  getInputClasses(fieldName: string, additionalClasses = ''): string {
    const field = this.productForm.get(fieldName);
    const baseClasses = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${additionalClasses}`;

    if (field?.invalid && field?.touched) {
      return `${baseClasses} border-red-300 dark:border-red-600 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10`;
    }

    return `${baseClasses} border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}