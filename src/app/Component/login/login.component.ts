import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/login', this.loginData)
      .subscribe(
        (response: any) => {
          // Show a success alert message
          alert('Login successful!');

          // Optionally store the JWT token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.user.username);

          // Redirect the user or perform additional actions
        },
        error => {
          // Show an error alert message
          alert('Login failed: Invalid email or password.');

          // Log the error (optional)
          console.error('Login failed', error);
        }
      );
  }
}
