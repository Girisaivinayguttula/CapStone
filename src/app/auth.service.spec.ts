import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);

    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and update login status', () => {
    service.login('test-token', false);

    expect(sessionStorage.getItem('token')).toBe('test-token');
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    expect(sessionStorage.getItem('isAdmin')).toBe('false');

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeFalse();
    });
  });

  it('should set admin status and update', () => {
    service.setAdminStatus(true);

    expect(sessionStorage.getItem('isAdmin')).toBe('true');

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });

  it('should logout and reset statuses', () => {
    // First login to set initial values
    service.login('test-token', true);

    service.logout();

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
    expect(sessionStorage.getItem('isAdmin')).toBeNull();

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeFalse();
    });
  });

  it('should correctly update login status from sessionStorage', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    service['updateLoginStatus'](); // Directly call the private method

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  it('should correctly update admin status from sessionStorage', () => {
    sessionStorage.setItem('isAdmin', 'true');
    service.updateAdminStatus(); // Since this is public, we can directly call it

    service.isAdmin$.subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });
});
