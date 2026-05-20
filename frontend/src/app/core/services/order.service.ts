/**
 * Order Service
 * Handles all HTTP interactions with the Order REST API.
 * All order endpoints require JWT authentication (handled by the interceptor).
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

/** Order model matching the backend schema */
export interface Order {
  _id: string;
  orderId: string;
  userId: number;
  productIds: Product[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

/** Standard API response wrapper */
export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface OrderListResponse {
  success: boolean;
  count: number;
  data: Order[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/orders';

  /** GET /api/orders - Fetch all orders for the authenticated user */
  getAll(): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(this.apiUrl);
  }

  /** GET /api/orders/:id - Fetch a single order */
  getById(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/orders - Create a new order from selected product IDs */
  create(productIds: string[]): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, { productIds });
  }

  /** PUT /api/orders/:id - Update order products */
  update(id: string, productIds: string[]): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}`, { productIds });
  }

  /** DELETE /api/orders/:id - Delete an order */
  delete(id: string): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${this.apiUrl}/${id}`);
  }
}
