import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  userEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserEmail();
  }

  getUserEmail() {
    // Assume the token is stored in local storage after login
    const token = localStorage.getItem('token');
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<any>('http://localhost:5000/api/user', { headers })
        .subscribe({
          next: (response) => {
            this.userEmail = response.email || ''; // Use the email from the response
          },
          error: (error) => {
            console.error('Error fetching user details:', error);
            this.userEmail = ''; // Default to empty if there's an error
          }
        });
    }
  }

  onSubscribe(email: string) {
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
  
    this.http.post('http://localhost:5000/api/subscribe', { email })
      .subscribe({
        next: () => {
          alert('You are subscribed to the newsletter!');
        },
        error: (error) => {
          console.error('Error during subscription:', error);
          alert('There was an error subscribing to the newsletter. Please try again later.');
        }
      });
  }
}  