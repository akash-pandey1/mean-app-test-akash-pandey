/**
 * Product Service
 * Handles all HTTP interactions with the Product REST API.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Product model matching the backend schema */
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Standard API response wrapper */
export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}

export interface ProductListResponse {
  success: boolean;
  count: number;
  data: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/products';

  /** GET /api/products - Fetch all products */
  getAll(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.apiUrl);
  }

  /** GET /api/products/:id - Fetch single product */
  getById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/products - Create a new product */
  create(product: { name: string; price: number; description?: string }): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, product);
  }

  /** PUT /api/products/:id - Update an existing product */
  update(id: string, product: { name?: string; price?: number; description?: string }): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  /** DELETE /api/products/:id - Delete a product */
  delete(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }
}
