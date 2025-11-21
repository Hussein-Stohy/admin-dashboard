import { Component, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { MockApiService, User } from '../../../core/services/mock-api.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    TableComponent,
    ModalComponent,
    LoadingComponent,
    FormFieldComponent,
    UserFormComponent
  ],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Default users data - displayed immediately
  private readonly defaultUsers: User[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=3b82f6&color=fff'
    },
    {
      id: '2',
      name: 'Fatima Al-Zahra',
      email: 'fatima.zahra@example.com',
      role: 'Manager',
      status: 'active',
      createdAt: new Date('2024-01-20'),
      avatar: 'https://ui-avatars.com/api/?name=Fatima+Al-Zahra&background=3b82f6&color=fff'
    },
    {
      id: '3',
      name: 'Omar Mohammed',
      email: 'omar.mohammed@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: new Date('2024-02-01'),
      avatar: 'https://ui-avatars.com/api/?name=Omar+Mohammed&background=3b82f6&color=fff'
    },
    {
      id: '4',
      name: 'Layla Ibrahim',
      email: 'layla.ibrahim@example.com',
      role: 'User',
      status: 'inactive',
      createdAt: new Date('2024-02-05'),
      avatar: 'https://ui-avatars.com/api/?name=Layla+Ibrahim&background=3b82f6&color=fff'
    },
    {
      id: '5',
      name: 'Khalid Ali',
      email: 'khalid.ali@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: new Date('2024-02-10'),
      avatar: 'https://ui-avatars.com/api/?name=Khalid+Ali&background=3b82f6&color=fff'
    }
  ];

  // Signals for state management
  public readonly loading = signal(false); // Start as false to show data immediately
  public readonly submitting = signal(false);
  public readonly deleting = signal(false);
  public readonly users = signal<User[]>(this.defaultUsers); // Initialize with default data
  public readonly totalItems = signal(this.defaultUsers.length);
  public readonly currentPage = signal(1);
  public readonly pageSize = signal(10);
  public readonly searchQuery = signal('');
  public readonly statusFilter = signal('');
  public readonly roleFilter = signal('');

  // Modal states
  public readonly showUserModal = signal(false);
  public readonly showDeleteModal = signal(false);
  public readonly editingUser = signal<User | null>(null);
  public readonly userToDelete = signal<User | null>(null);

  // Form for search/filters
  searchForm: FormGroup;

  // Table configuration
  tableColumns: TableColumn[] = [
    {
      key: 'avatar',
      label: '',
      width: '60px',
      type: 'text'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      type: 'date'
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions',
      width: '120px'
    }
  ];

  // Computed values - Force immediate evaluation
  readonly filteredUsers = computed(() => {
    // Get current values
    let filtered = [...this.users()]; // Create a copy to ensure reactivity

    const search = this.searchQuery().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    const status = this.statusFilter().trim();
    if (status) {
      filtered = filtered.filter(user => user.status === status);
    }

    const role = this.roleFilter().trim();
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }

    return filtered;
  });


  constructor(
    private fb: FormBuilder,
    private mockApiService: MockApiService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      status: [''],
      role: ['']
    });

    // Subscribe to form changes with debouncing for search
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchQuery.set(value || '');
      this.loadUsers(); // Reload data when search changes
    });

    this.searchForm.get('status')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.statusFilter.set(value || '');
    });

    this.searchForm.get('role')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.roleFilter.set(value || '');
    });

    // Trigger immediate update to show data
    setTimeout(() => {
      this.statusFilter.set('');
      this.roleFilter.set('');
      this.searchQuery.set('');
    }, 0);
  }

  // Expose signals for template
  getLoading() { return this.loading(); }
  getSubmitting() { return this.submitting(); }
  getDeleting() { return this.deleting(); }
  getUsers() { return this.users(); }
  getTotalItems() { return this.totalItems(); }
  getCurrentPage() { return this.currentPage(); }
  getPageSize() { return this.pageSize(); }
  getShowUserModal() { return this.showUserModal(); }
  getShowDeleteModal() { return this.showDeleteModal(); }
  getEditingUser() { return this.editingUser(); }
  getUserToDelete() { return this.userToDelete(); }
  getModalTitle() {
    return this.editingUser() ? 'Edit User' : 'Add New User';
  }

  // Force computed update
  getFilteredUsers() {
    return this.filteredUsers();
  }

  getUserAvatarUrl(name: string): string {
    return 'https://ui-avatars.com/api/?name=' + name.replace(' ', '+') + '&background=3b82f6&color=fff';
  }

  ngOnInit(): void {
    // Force immediate data display
    this.users.set([...this.defaultUsers]);
    this.totalItems.set(this.defaultUsers.length);

    // Load data from API in background while showing default data
    setTimeout(() => {
      this.loadUsersFromAPI();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading.set(true);
      const { users, total } = await this.mockApiService.getUsers(
        this.currentPage(),
        this.pageSize(),
        this.searchQuery() // Pass search query to API
      );
      this.users.set(users);
      this.totalItems.set(total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // Load users from API in background
  private async loadUsersFromAPI(): Promise<void> {
    try {
      // Don't show loading state for initial load since we have default data
      const { users, total } = await this.mockApiService.getUsers(
        this.currentPage(),
        this.pageSize(),
        this.searchQuery()
      );
      // Replace with API data if available, otherwise keep default data
      if (users && users.length > 0) {
        this.users.set([...this.defaultUsers, ...users]);
        this.totalItems.set(this.defaultUsers.length + total);
      }
    } catch (error) {
      console.error('Error loading users from API:', error);
      // Keep default data if API fails
    }
  }

  openCreateModal(): void {
    this.editingUser.set(null);
    this.showUserModal.set(true);
  }

  editUser(user: User): void {
    this.editingUser.set(user);
    this.showUserModal.set(true);
  }

  closeUserModal(): void {
    this.showUserModal.set(false);
    this.editingUser.set(null);
  }

  async handleUserSubmit(userData: Partial<User>): Promise<void> {
    try {
      this.submitting.set(true);

      if (this.editingUser()) {
        await this.mockApiService.updateUser(this.editingUser()!.id, userData);
      } else {
        await this.mockApiService.createUser(userData);
      }

      this.closeUserModal();
      this.loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      this.submitting.set(false);
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.userToDelete.set(null);
  }

  async deleteUser(): Promise<void> {
    const user = this.userToDelete();
    if (!user) return;

    try {
      this.deleting.set(true);
      await this.mockApiService.deleteUser(user.id);
      this.closeDeleteModal();
      this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      this.deleting.set(false);
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  onSortChange(event: any): void {
    // TODO: Implement sorting
    console.log('Sort changed:', event);
  }
}