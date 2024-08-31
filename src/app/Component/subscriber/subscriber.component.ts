import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscriber',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {
  subscriptions: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSubscriptions();
  }

  fetchSubscriptions() {
    const apiUrl = 'http://localhost:5000/api/subscriptions'; // Update with your actual backend URL
    this.http.get<string[]>(apiUrl).subscribe(
      (data) => {
        this.subscriptions = data;
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }
}
