import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface User {
  username: string;
  email: string;
  // Add other fields as needed
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.http.get<User>('http://localhost:5000/api/user').subscribe({
      next: (data) => {
        console.log('User data fetched:', data); // Debugging line
        this.user = data;
        this.loading = false; // Data is loaded
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        this.error = 'Failed to load user profile.';
        this.loading = false; // Data loading failed
      }
    });
  }
}
