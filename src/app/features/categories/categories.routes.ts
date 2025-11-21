import { Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

export const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesListComponent
  },
  {
    path: 'create',
    component: CategoryFormComponent
  },
  {
    path: 'edit/:id',
    component: CategoryFormComponent
  }
];