import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '../categories.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    FormFieldComponent
  ],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditing = false;
  categoryId: string | null = null;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.categoryId;

    if (this.isEditing && this.categoryId) {
      this.loadCategory();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      icon: ['', Validators.required],
      color: ['#3B82F6', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      status: ['active', Validators.required],
      productCount: [0, [Validators.min(0)]]
    });
  }

  private async loadCategory(): Promise<void> {
    if (!this.categoryId) return;

    this.loading.set(true);
    try {
      const category = await this.categoriesService.getCategoryById(this.categoryId);
      if (category) {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          status: category.status,
          productCount: category.productCount
        });
      } else {
        this.router.navigate(['/categories']);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);
    try {
      const formValue = this.categoryForm.value;

      if (this.isEditing && this.categoryId) {
        await this.categoriesService.updateCategory(this.categoryId, formValue);
      } else {
        // Set default product count to 0 for new categories
        formValue.productCount = 0;
        await this.categoriesService.createCategory(formValue);
      }

      this.router.navigate(['/categories']);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCategory(): Promise<void> {
    if (!this.categoryId) return;

    const categoryName = this.categoryForm.get('name')?.value;
    const productCount = this.categoryForm.get('productCount')?.value || 0;

    const confirmMessage = productCount > 0
      ? `Are you sure you want to delete "${categoryName}"? This will affect ${productCount} products.`
      : `Are you sure you want to delete "${categoryName}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.loading.set(true);
    try {
      await this.categoriesService.deleteCategory(this.categoryId);
      this.router.navigate(['/categories']);
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  getInputClasses(fieldName: string, additionalClasses = ''): string {
    const field = this.categoryForm.get(fieldName);
    const baseClasses = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${additionalClasses}`;

    if (field?.invalid && field?.touched) {
      return `${baseClasses} border-red-300 dark:border-red-600 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10`;
    }

    return `${baseClasses} border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700`;
  }

  getContrastColor(hexColor: string): string {
    // Remove the hash if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Return black or white based on brightness
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }
}