/**
 * Product Form Component
 * A modal overlay form for creating or editing a product.
 * Receives an existing product for editing via input, emits save/cancel events.
 */

import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  template: `
    <!-- Modal overlay -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="onCancel()">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Modal card (stop propagation to prevent closing when clicking inside) -->
      <div
        class="relative w-full max-w-lg backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-2xl shadow-2xl p-6 animate-in"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">
            {{ product() ? 'Edit Product' : 'New Product' }}
          </h3>
          <button
            (click)="onCancel()"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label for="productName" class="block text-sm font-medium text-gray-300 mb-1.5">Product Name *</label>
            <input
              id="productName"
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="Enter product name"
              required
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            />
          </div>

          <div>
            <label for="productPrice" class="block text-sm font-medium text-gray-300 mb-1.5">Price (₹) *</label>
            <input
              id="productPrice"
              type="number"
              [(ngModel)]="price"
              name="price"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
            />
          </div>

          <div>
            <label for="productDescription" class="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              id="productDescription"
              [(ngModel)]="description"
              name="description"
              placeholder="Enter product description"
              rows="3"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
            ></textarea>
          </div>

          @if (formError()) {
            <div class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
              {{ formError() }}
            </div>
          }

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              (click)="onCancel()"
              class="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              {{ product() ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .animate-in {
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `
})
export class ProductFormComponent {
  /** Input: product to edit (null for create mode) */
  readonly product = input<Product | null>(null);

  /** Output events */
  readonly save = output<{ name: string; price: number; description: string }>();
  readonly cancel = output<void>();

  name = '';
  price: number | null = null;
  description = '';
  formError = signal('');

  constructor() {
    // Use effect to populate form fields when editing
    effect(() => {
      const p = this.product();
      if (p) {
        this.name = p.name;
        this.price = p.price;
        this.description = p.description || '';
      } else {
        this.name = '';
        this.price = null;
        this.description = '';
      }
    });
  }

  onSubmit(): void {
    this.formError.set('');

    if (!this.name.trim()) {
      this.formError.set('Product name is required.');
      return;
    }
    if (this.price === null || this.price < 0) {
      this.formError.set('Price must be a non-negative number.');
      return;
    }

    this.save.emit({
      name: this.name.trim(),
      price: this.price,
      description: this.description.trim(),
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
