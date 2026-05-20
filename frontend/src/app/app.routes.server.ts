/**
 * SSR Server Routes Configuration
 * Uses Client rendering mode for all routes since this app depends on
 * browser APIs (localStorage for auth) and dynamic data.
 */

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
