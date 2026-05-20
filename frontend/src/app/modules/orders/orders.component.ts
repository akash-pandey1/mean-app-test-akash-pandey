/**
 * Orders Component
 * Displays the authenticated user's orders and allows creating new orders
 * by selecting products from the catalog.
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, OrderService } from '../../core/services/order.service';
import { Product, ProductService } from '../../core/services/product.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [FormsModule,DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">Orders</h2>
          <p class="text-gray-400 text-sm mt-1">View and manage your orders</p>
        </div>
        <button
          (click)="toggleCreateMode()"
          class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          {{ showCreatePanel() ? 'Cancel' : 'New Order' }}
        </button>
      </div>

      <!-- Create Order Panel -->
      @if (showCreatePanel()) {
        <div class="backdrop-blur-xl bg-white/5 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
          <h3 class="text-lg font-semibold text-white">Select Products for Your Order</h3>

          @if (availableProducts().length === 0) {
            <p class="text-gray-400 text-sm">No products available. Please add products first.</p>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (product of availableProducts(); track product._id) {
                <label
                  class="flex items-center gap-3 p-3 bg-white/5 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10"
                  [class.border-emerald-500/50]="selectedProductIds().has(product._id)"
                  [class.bg-emerald-500/10]="selectedProductIds().has(product._id)"
                  [class.border-white/10]="!selectedProductIds().has(product._id)"
                >
                  <input
                    type="checkbox"
                    [checked]="selectedProductIds().has(product._id)"
                    (change)="toggleProductSelection(product._id)"
                    class="w-4 h-4 accent-emerald-500"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ product.name }}</p>
                    <p class="text-emerald-400 text-xs">₹{{ product.price.toFixed(2) }}</p>
                  </div>
                </label>
              }
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <div class="text-gray-300">
                <span class="text-sm">Selected: {{ selectedProductIds().size }} items</span>
                <span class="mx-2 text-gray-600">|</span>
                <span class="text-emerald-400 font-semibold">Total: ₹{{ selectedTotal().toFixed(2) }}</span>
              </div>
              <button
                (click)="createOrder()"
                [disabled]="selectedProductIds().size === 0 || isCreating()"
                class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (isCreating()) {
                  Placing Order...
                } @else {
                  Place Order
                }
              </button>
            </div>
          }
        </div>
      }

      <!-- Error/Success messages -->
      @if (errorMessage()) {
        <div class="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
          {{ errorMessage() }}
        </div>
      }
      @if (successMessage()) {
        <div class="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-center">
          {{ successMessage() }}
        </div>
      }

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      }

      <!-- Orders list -->
      @if (!isLoading() && orders().length > 0) {
        <div class="space-y-4">
          @for (order of orders(); track order._id) {
            <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-300">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <p class="text-white font-semibold">Order #{{ order._id.slice(-8).toUpperCase() }}</p>
                  <p class="text-gray-500 text-xs mt-0.5">{{ order.createdAt | date:'medium' }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium">
                    ₹{{ order.totalAmount.toFixed(2) }}
                  </span>
                  <button
                    (click)="deleteOrder(order._id)"
                    class="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all duration-200"
                    title="Delete order"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Order products -->
              <div class="flex flex-wrap gap-2">
                @for (product of order.productIds; track product._id) {
                  <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm">
                    {{ product.name }} — ₹{{ product.price.toFixed(2) }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Empty state -->
      @if (!isLoading() && orders().length === 0 && !showCreatePanel()) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <p class="text-gray-400">No orders yet. Create your first order!</p>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);

  orders = signal<Order[]>([]);
  availableProducts = signal<Product[]>([]);
  selectedProductIds = signal<Set<string>>(new Set());
  isLoading = signal(false);
  isCreating = signal(false);
  showCreatePanel = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  /** Computed total from selected products */
  selectedTotal = computed(() => {
    const ids = this.selectedProductIds();
    return this.availableProducts()
      .filter((p) => ids.has(p._id))
      .reduce((sum, p) => sum + p.price, 0);
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.orderService.getAll().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.orders.set(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to load orders.');
      },
    });
  }

  toggleCreateMode(): void {
    const current = this.showCreatePanel();
    this.showCreatePanel.set(!current);
    this.selectedProductIds.set(new Set());
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!current) {
      // Load products for selection
      this.productService.getAll().subscribe({
        next: (res) => {
          if (res.success) {
            this.availableProducts.set(res.data);
          }
        },
        error: () => {
          this.errorMessage.set('Failed to load products.');
        },
      });
    }
  }

  toggleProductSelection(productId: string): void {
    const current = new Set(this.selectedProductIds());
    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
    }
    this.selectedProductIds.set(current);
  }

  createOrder(): void {
    const ids = Array.from(this.selectedProductIds());
    if (ids.length === 0) return;

    this.isCreating.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.orderService.create(ids).subscribe({
      next: (res) => {
        this.isCreating.set(false);
        if (res.success) {
          this.successMessage.set('Order placed successfully!');
          this.showCreatePanel.set(false);
          this.selectedProductIds.set(new Set());
          this.loadOrders();
          setTimeout(() => this.successMessage.set(''), 3000);
        }
      },
      error: (err) => {
        this.isCreating.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to create order.');
      },
    });
  }

  deleteOrder(id: string): void {
    if (!confirm('Are you sure you want to delete this order?')) return;

    this.orderService.delete(id).subscribe({
      next: () => this.loadOrders(),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to delete order.');
      },
    });
  }
}
