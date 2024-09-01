import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and update login status', () => {
    service.login('test-token', false);

    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(localStorage.getItem('isAdmin')).toBe('false');

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeFalse();
    });
  });

  it('should set admin status and update', () => {
    service.setAdminStatus(true);

    expect(localStorage.getItem('isAdmin')).toBe('true');

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });

  it('should logout and reset statuses', () => {
    // First login to set initial values
    service.login('test-token', true);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('isAdmin')).toBeNull();

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeFalse();
    });
  });

  it('should correctly update login status from localStorage', () => {
    localStorage.setItem('isLoggedIn', 'true');
    service['updateLoginStatus'](); // Directly call the private method

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  it('should correctly update admin status from localStorage', () => {
    localStorage.setItem('isAdmin', 'true');
    service.updateAdminStatus(); // Since this is public, we can directly call it

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });
});
