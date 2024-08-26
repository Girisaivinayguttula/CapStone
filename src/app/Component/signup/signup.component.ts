import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male' // Default value
  };

  alertVisible = false;
  alertMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    console.log('User Data:', this.user); // Log the user data
  
    // Ensure password and confirmPassword match before proceeding
    if (this.user.password !== this.user.confirmPassword) {
      this.alertMessage = 'Passwords do not match. Please try again.';
      this.alertVisible = true;
      setTimeout(() => this.alertVisible = false, 3000);
      return;
    }
  
    this.http.post('http://localhost:5000/api/signup', this.user)
      .subscribe(
        response => {
          console.log('User signed up successfully', response);
          this.alertMessage = 'Signup successful! Redirecting to login page...';
          this.alertVisible = true;
          setTimeout(() => {
            this.alertVisible = false;
            this.router.navigate(['/login']);
          }, 1000);
        },
        error => {
          console.error('Error signing up', error);
          this.alertMessage = 'Signup failed. Please try again.';
          this.alertVisible = true;
          setTimeout(() => this.alertVisible = false, 3000);
        }
      );
  }
}  