import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  user: any;
  isLoggedIn = false;

  private readonly adminEmail = 'admin@gmail.com';
  private readonly adminPassword = 'adminpass';

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.isLoggedIn = true;
      this.getUserDetails();
    }
  }

  onSubmit(): void {
    if (this.isAdminLogin()) {
      this.handleAdminLogin();
    } else {
      this.handleUserLogin();
    }
  }

  private isAdminLogin(): boolean {
    return this.loginData.email === this.adminEmail && this.loginData.password === this.adminPassword;
  }

  private handleAdminLogin(): void {
    this.user = {
      name: 'Admin User',
      email: this.adminEmail,
      phone: '123-456-7890',
      gender: 'Male'
    };
    this.handleLogin('hardcoded-token', true);
  }

  private handleUserLogin(): void {
    this.loginService.login(this.loginData).subscribe(
      (response: any) => {
        this.handleLogin(response.token, response.isAdmin);
      },
      error => {
        this.showError('Login failed: Invalid email or password.');
      }
    );
  }

  private handleLogin(token: string, isAdmin: boolean): void {
    this.storeLoginInfo(token, isAdmin);
    this.getUserDetails();
    this.authService.updateAdminStatus();
    this.navigateToHome();
  }

  private storeLoginInfo(token: string, isAdmin: boolean): void {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    this.isLoggedIn = true;
  }

  private getUserDetails(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.loginService.getUserDetails(token).subscribe(
      data => this.user = data,
      err => this.showError('Failed to fetch user details.')
    );
  }

  private navigateToHome(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.user = null;
    this.cd.detectChanges();
    this.navigateToHome();
  }
}
