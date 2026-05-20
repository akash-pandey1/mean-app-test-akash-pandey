/**
 * Register Component
 * Provides a premium registration form with validation.
 * On success, redirects to the login page.
 */

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4">
      <!-- Animated background orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1.5s"></div>
      </div>

      <div class="relative w-full max-w-md">
        <!-- Glassmorphic card -->
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/25">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-white">Create Account</h1>
            <p class="text-gray-400 mt-1">Join us today</p>
          </div>

          <!-- Success message -->
          @if (successMessage()) {
            <div class="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm text-center">
              {{ successMessage() }}
            </div>
          }

          <!-- Error message -->
          @if (errorMessage()) {
            <div class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
              {{ errorMessage() }}
            </div>
          }

          <!-- Register form -->
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="Choose a username"
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Create a password (min 6 chars)"
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              @if (isLoading()) {
                <span class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              } @else {
                Create Account
              }
            </button>
          </form>

          <!-- Login link -->
          <p class="text-center text-gray-400 text-sm mt-6">
            Already have an account?
            <a routerLink="/login" class="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  confirmPassword = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    // ── Client-side validation ─────────────────────────────────
    if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    if (this.username.trim().length < 3) {
      this.errorMessage.set('Username must be at least 3 characters.');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('Account created! Redirecting to login...');
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage.set(response.message || 'Registration failed.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'An error occurred. Please try again.');
      },
    });
  }
}
