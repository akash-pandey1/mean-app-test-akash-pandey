/**
 * Auth Service
 * Handles user authentication (login/register) API calls.
 * Manages JWT token storage in localStorage and exposes reactive auth state via signals.
 */

import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/** Response shape from auth endpoints */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    token?: string;
  };
}

/** Decoded user info stored in auth state */
export interface AuthUser {
  id: number;
  username: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  /** Reactive signal holding the current authenticated user (or null) */
  private readonly currentUser = signal<AuthUser | null>(null);

  /** Public read-only computed signals */
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly username = computed(() => this.currentUser()?.username ?? '');

  constructor() {
    this.loadFromStorage();
  }

  /**
   * POST /api/auth/register
   * Registers a new user account.
   */
  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, password });
  }

  /**
   * POST /api/auth/login
   * Authenticates and stores the JWT token.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.success && response.data?.token) {
          const authUser: AuthUser = {
            id: response.data.id,
            username: response.data.username,
            token: response.data.token,
          };
          this.currentUser.set(authUser);
          this.saveToStorage(authUser);
        }
      })
    );
  }

  /**
   * Clears auth state and removes token from storage.
   */
  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Returns the raw JWT token string (used by the interceptor).
   */
  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  // ── Private helpers ──────────────────────────────────────────

  private saveToStorage(user: AuthUser): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  private loadFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          const parsed: AuthUser = JSON.parse(stored);
          this.currentUser.set(parsed);
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
  }
}
