import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Track general login status
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    this.updateLoginStatus(); // Initialize login status
    this.updateAdminStatus(); // Initialize admin status
  }

  updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }

  updateAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isAdminSubject.next(isAdmin);
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.updateLoginStatus();
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    this.updateLoginStatus();
    this.updateAdminStatus();
  }

  setAdminStatus(isAdmin: boolean) {
    localStorage.setItem('isAdmin', isAdmin.toString());
    this.updateAdminStatus();
  }
}
