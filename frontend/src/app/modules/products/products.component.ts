/**
 * Products Component
 * Displays a product catalog with search, and provides actions
 * for create, edit, and delete operations.
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../core/services/product.service';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-products',
  imports: [FormsModule, ProductFormComponent],
  template: `
    <div class="space-y-6">
      <!-- Header bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">Products</h2>
          <p class="text-gray-400 text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </button>
      </div>

      <!-- Search bar -->
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search products..."
          class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
        />
      </div>

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      }

      <!-- Error state -->
      @if (errorMessage()) {
        <div class="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
          {{ errorMessage() }}
        </div>
      }

      <!-- Product grid -->
      @if (!isLoading() && filteredProducts().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (product of filteredProducts(); track product._id) {
            <div class="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{{ product.name }}</h3>
                <span class="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
                  ₹{{ product.price.toFixed(2) }}
                </span>
              </div>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ product.description || 'No description available.' }}</p>
              <div class="flex items-center gap-2 pt-3 border-t border-white/5">
                <button
                  (click)="openEditForm(product)"
                  class="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
                <button
                  (click)="deleteProduct(product._id)"
                  class="flex-1 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty state -->
      @if (!isLoading() && filteredProducts().length === 0 && !errorMessage()) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <p class="text-gray-400">No products found. Create one to get started!</p>
        </div>
      }

      <!-- Product form modal overlay -->
      @if (showForm()) {
        <app-product-form
          [product]="editingProduct()"
          (save)="onFormSave($event)"
          (cancel)="closeForm()"
        />
      }
    </div>
  `,
  styles: ``
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  searchQuery = '';
  isLoading = signal(false);
  errorMessage = signal('');
  showForm = signal(false);
  editingProduct = signal<Product | null>(null);

  /** Computed filtered list based on search query */
  filteredProducts = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.products();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.productService.getAll().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.products.set(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to load products.');
      },
    });
  }

  openCreateForm(): void {
    this.editingProduct.set(null);
    this.showForm.set(true);
  }

  openEditForm(product: Product): void {
    this.editingProduct.set(product);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
  }

  onFormSave(data: { name: string; price: number; description: string }): void {
    const editing = this.editingProduct();
    if (editing) {
      // Update existing product
      this.productService.update(editing._id, data).subscribe({
        next: () => {
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update product.');
        },
      });
    } else {
      // Create new product
      this.productService.create(data).subscribe({
        next: () => {
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to create product.');
        },
      });
    }
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to delete product.');
      },
    });
  }
}
