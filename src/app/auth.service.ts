import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Track general login status
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

  constructor() {
    this.initializeAuthStatus();
  }

  private initializeAuthStatus() {
    this.updateLoginStatus();
    this.updateAdminStatus();
  }

  private updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }

  public updateAdminStatus() { // Change this to public
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isAdminSubject.next(isAdmin);
  }

  public login(token: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    this.setAdminStatus(isAdmin);
    this.updateLoginStatus();
    this.updateAdminStatus();
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    this.updateLoginStatus();
    this.updateAdminStatus();
  }

  public setAdminStatus(isAdmin: boolean) {
    localStorage.setItem('isAdmin', isAdmin.toString());
    this.updateAdminStatus();
  }
}
