import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent)
  }
];