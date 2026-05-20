/**
 * Dashboard Component
 * Central workspace with sidebar navigation, weather widget,
 * quick statistics, and a router outlet for child pages.
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { WeatherData, WeatherService } from '../core/services/weather.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DatePipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      <!-- ── Sidebar ──────────────────────────────────────────── -->
      <aside class="w-64 bg-white/[0.03] border-r border-white/10 flex flex-col shrink-0">
        <!-- Brand -->
        <div class="p-6 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-white font-bold text-lg">MEAN Portal</h1>
              <p class="text-gray-500 text-xs">Enterprise Dashboard</p>
            </div>
          </div>
        </div>

        <!-- Navigation links -->
        <nav class="flex-1 p-4 space-y-1">
          <a
            routerLink="/dashboard"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="bg-gradient-to-r from-purple-500/20 to-blue-500/10 border-purple-500/30 text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="font-medium text-sm">Overview</span>
          </a>

          <a
            routerLink="/dashboard/products"
            routerLinkActive="bg-gradient-to-r from-purple-500/20 to-blue-500/10 border-purple-500/30 text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span class="font-medium text-sm">Products</span>
          </a>

          <a
            routerLink="/dashboard/orders"
            routerLinkActive="bg-gradient-to-r from-purple-500/20 to-blue-500/10 border-purple-500/30 text-white"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span class="font-medium text-sm">Orders</span>
          </a>
        </nav>

        <!-- User section at bottom -->
        <div class="p-4 border-t border-white/10">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
              {{ authService.username().charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ authService.username() }}</p>
              <p class="text-gray-500 text-xs">Authenticated</p>
            </div>
            <button
              (click)="logout()"
              title="Logout"
              class="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- ── Main content area ──────────────────────────────── -->
      <main class="flex-1 overflow-y-auto">
        <!-- Top bar -->
        <header class="sticky top-0 z-10 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-white font-semibold">Welcome back, {{ authService.username() }}!</h2>
              <p class="text-gray-500 text-sm">{{ today | date:'fullDate' }}</p>
            </div>

            <!-- Weather widget (compact) -->
            @if (weather(); as w) {
              <div class="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <span class="text-2xl">{{ getWeatherEmoji(w.weatherCode, w.isDay) }}</span>
                <div>
                  <p class="text-white text-sm font-medium">{{ w.temperature }}°C</p>
                  <p class="text-gray-400 text-xs">{{ w.weatherDescription }}</p>
                </div>
              </div>
            } @else if (weatherLoading()) {
              <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <div class="animate-pulse flex items-center gap-2">
                  <div class="w-6 h-6 bg-white/10 rounded"></div>
                  <div class="w-16 h-4 bg-white/10 rounded"></div>
                </div>
              </div>
            }
          </div>
        </header>

        <!-- Page content -->
        <div class="p-8">
          <router-outlet />

          <!-- Default overview content (shown only when at /dashboard exact) -->
          @if (isOverviewPage) {
            <div class="space-y-8">
              <!-- Stats row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Products stat -->
                <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-gray-400 text-sm">Products</p>
                  <p class="text-white text-3xl font-bold mt-1">Manage</p>
                  <a routerLink="/dashboard/products" class="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block transition-colors">View all →</a>
                </div>

                <!-- Orders stat -->
                <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-gray-400 text-sm">Orders</p>
                  <p class="text-white text-3xl font-bold mt-1">Track</p>
                  <a routerLink="/dashboard/orders" class="text-emerald-400 text-sm hover:text-emerald-300 mt-2 inline-block transition-colors">View all →</a>
                </div>

                <!-- Weather detail card -->
                <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                      </svg>
                    </div>
                  </div>
                  @if (weather(); as w) {
                    <p class="text-gray-400 text-sm">Weather Now</p>
                    <p class="text-white text-3xl font-bold mt-1">{{ w.temperature }}°C</p>
                    <div class="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                      <span>💨 {{ w.windSpeed }} km/h</span>
                      <span>💧 {{ w.humidity }}%</span>
                    </div>
                  } @else {
                    <p class="text-gray-400 text-sm">Weather</p>
                    <p class="text-white text-lg mt-1">Loading...</p>
                  }
                </div>
              </div>

              <!-- Quick actions -->
              <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 class="text-white font-semibold mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    routerLink="/dashboard/products"
                    class="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-all duration-200 group"
                  >
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span class="text-gray-300 group-hover:text-white text-sm font-medium">Add Product</span>
                  </a>
                  <a
                    routerLink="/dashboard/orders"
                    class="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all duration-200 group"
                  >
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                    </svg>
                    <span class="text-gray-300 group-hover:text-white text-sm font-medium">Create Order</span>
                  </a>
                  <button
                    (click)="refreshWeather()"
                    class="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all duration-200 group text-left"
                  >
                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span class="text-gray-300 group-hover:text-white text-sm font-medium">Refresh Weather</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly weatherService = inject(WeatherService);
  private readonly router = inject(Router);

  weather = signal<WeatherData | null>(null);
  weatherLoading = signal(false);
  weatherError = signal('');
  today = new Date();

  /** Determines if we're on the exact /dashboard route to show overview content */
  get isOverviewPage(): boolean {
    return this.router.url === '/dashboard';
  }

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.weatherLoading.set(true);
    this.weatherError.set('');
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        this.weather.set(data);
        this.weatherLoading.set(false);
      },
      error: (err) => {
        this.weatherError.set('Failed to load weather');
        this.weatherLoading.set(false);
      },
    });
  }

  refreshWeather(): void {
    this.loadWeather();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** Maps WMO weather codes to emoji for a quick visual indicator */
  getWeatherEmoji(code: number, isDay: boolean): string {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code <= 3) return isDay ? '⛅' : '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌦️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '❄️';
    if (code <= 82) return '🌧️';
    return '⛈️';
  }
}
