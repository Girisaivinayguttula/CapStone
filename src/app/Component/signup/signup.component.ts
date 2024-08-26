import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:5000/api/signup', this.user)
      .subscribe(
        response => {
          console.log('User signed up successfully', response);
          alert('Signup successful!'); // Alert added here
        },
        error => {
          console.error('Error signing up', error);
          // Log error details for further investigation
          if (error.error) {
            console.error('Error details:', error.error);
          } else {
            console.error('Error details:', error.message);
          }
          alert('Signup failed. Please try again.'); // Alert for failure
        }
      );
  }
}
