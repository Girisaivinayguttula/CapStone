import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  user: any;
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  private adminEmail = 'admin@gmail.com';
  private adminPassword = 'adminpass';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isLoggedIn) {
      this.getUserDetails();
    }
  }

  onSubmit() {
    if (this.loginData.email === this.adminEmail && this.loginData.password === this.adminPassword) {
      this.user = {
        name: 'Admin User',
        email: this.adminEmail,
        phone: '123-456-7890',
        gender: 'Male'
      };
      this.handleLogin('hardcoded-token', true);
    } else {
      this.http.post('http://localhost:5000/api/login', this.loginData).subscribe(
        (response: any) => {
          this.handleLogin(response.token, response.isAdmin);
        },
        error => {
          alert('Login failed: Invalid email or password.');
          console.error('Login failed', error);
        }
      );
    }
  }

  handleLogin(token: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    this.isLoggedIn = true;
    this.getUserDetails();
    this.authService.updateAdminStatus();
    this.cd.detectChanges();
    this.router.navigate(['/']).then(() => {
      window.location.reload(); // Refresh the page after redirecting to home
    });
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get('http://localhost:5000/api/user', { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      data => this.user = data,
      err => console.error('Failed to fetch user details:', err)
    );
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.user = null;
    this.cd.detectChanges();
    this.router.navigate(['/']).then(() => {
      window.location.reload(); // Refresh the page after redirecting to home
    });
  }
}
