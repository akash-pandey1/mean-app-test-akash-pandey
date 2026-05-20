/**
 * Auth Interceptor (Functional)
 * Attaches the JWT token from AuthService to every outgoing HTTP request
 * as a Bearer token in the Authorization header.
 */

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only attach token to our API requests (not third-party APIs like weather)
  if (token && req.url.includes('localhost:5000')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
