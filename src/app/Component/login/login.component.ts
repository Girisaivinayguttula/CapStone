import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';  // Import the AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  private adminEmail = 'admin@gmail.com';
  private adminPassword = 'adminpass';

  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  onSubmit() {
    if (this.loginData.email === this.adminEmail && this.loginData.password === this.adminPassword) {
      localStorage.setItem('token', 'hardcoded-token');
      localStorage.setItem('username', 'admin');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isLoggedIn', 'true');
      this.authService.updateAdminStatus(); // Notify AuthService
      alert('Login successful!');
      
    } else {
      this.http.post('http://localhost:5000/api/login', this.loginData)
        .subscribe(
          (response: any) => {
            alert('Login successful!');
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('isAdmin', response.user.isAdmin ? 'true' : 'false');
            localStorage.setItem('isLoggedIn', 'true');
            this.authService.updateAdminStatus(); // Notify AuthService
          },
          error => {
            alert('Login failed: Invalid email or password.');
            console.error('Login failed', error);
          }
        );
    }
  }
}
