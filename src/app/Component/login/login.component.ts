import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  user: any;
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Initialize login state

  private adminEmail = 'admin@gmail.com';
  private adminPassword = 'adminpass';

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private router: Router,
    private cd: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check if user is already logged in and fetch user details
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
      localStorage.setItem('token', 'hardcoded-token');
      localStorage.setItem('username', this.user.name);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedIn = true;
      this.authService.updateAdminStatus(); 
      this.cd.detectChanges(); // Trigger change detection
    } else {
      this.http.post('http://localhost:5000/api/login', this.loginData)
        .subscribe(
          (response: any) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('isLoggedIn', 'true');
            this.isLoggedIn = true;
            this.getUserDetails(); // Fetch user details after login
            this.authService.updateAdminStatus(); 
            this.cd.detectChanges(); // Trigger change detection
          },
          error => {
            alert('Login failed: Invalid email or password.');
            console.error('Login failed', error);
          }
        );
    }
  }

  getUserDetails() {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
  
    this.http.get('http://localhost:5000/api/user', { // Use the full URL for API request
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Failed to fetch user details:', err)
    });
  }
  

  logout() {
    localStorage.clear(); // Clear all localStorage data
    this.isLoggedIn = false; // Reset login state
    this.user = null; // Clear user data
    this.cd.detectChanges(); // Trigger change detection
    this.router.navigate(['/']); // Redirect to the login page or any desired route
  }
}
