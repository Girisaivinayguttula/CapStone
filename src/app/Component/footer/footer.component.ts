import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuscriberService } from '../subscriber/suscriber.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  userEmail: string = '';
  subscriptions: string[] = [];

  constructor(private suscriberService: SuscriberService) {}

  ngOnInit() {
    this.getUserEmail();
    this.fetchSubscriptions();
  }

  getUserEmail() {
    this.suscriberService.getUserEmail().subscribe({
      next: (response) => {
        this.userEmail = response.email || '';
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.userEmail = '';
      }
    });
  }

  fetchSubscriptions() {
    this.suscriberService.fetchSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
      },
      error: (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    });
  }

  onSubscribe(email: string) {
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }

    this.suscriberService.subscribeEmail(email).subscribe({
      next: () => {
        alert('You are subscribed to the newsletter!');
        this.fetchSubscriptions();
      },
      error: (error) => {
        alert('There was an error subscribing to the newsletter. Please try again later.');
      }
    });
  }
}