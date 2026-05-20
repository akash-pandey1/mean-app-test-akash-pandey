import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService, AuthResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('registers with the auth API', () => {
    const mockResponse: AuthResponse = {
      success: true,
      message: 'Registered',
      data: { id: 5, username: 'akash', token: 'abc' },
    };

    service.register('akash', 'password').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'akash', password: 'password' });
    req.flush(mockResponse);
  });

  it('logs in and stores auth user state', () => {
    const mockResponse: AuthResponse = {
      success: true,
      message: 'Logged in',
      data: { id: 1, username: 'akash', token: 'token-123' },
    };

    service.login('akash', 'password').subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getToken()).toBe('token-123');
      expect(localStorage.getItem('auth_user')).toContain('token-123');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'akash', password: 'password' });
    req.flush(mockResponse);
  });

  it('clears localStorage on logout', () => {
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, username: 'akash', token: 'token-123' }));
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});
