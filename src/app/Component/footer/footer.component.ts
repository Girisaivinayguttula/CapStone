import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuscriberService } from '../subscriber/suscriber.service';
import { NotificationService } from '../../notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  userEmail: string = '';
  subscriptions: string[] = [];
  isLoggedIn: boolean = false;
  private destroy$ = new Subject<void>();
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(
    private readonly suscriberService: SuscriberService, 
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthStatus(): void {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole'); // Add this line
    this.isLoggedIn = Boolean(token);
    
    if (this.isLoggedIn && userRole === 'user') { // Modified condition
      this.getUserEmail();
    }
  }

  private getUserEmail(): void {
    this.suscriberService.getUserEmail()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.userEmail = response?.email ?? '';
        },
        error: (error) => {
          if (error?.status === 403) {
            this.handleAuthError();
          }
          this,this.notificationService.showError('Error fetching user email:', error);
        }
      });
  }

  private handleAuthError(): void {
    sessionStorage.removeItem('token');
    this.isLoggedIn = false;
    this.userEmail = '';
  }

  fetchSubscriptions(): void {
    this.suscriberService.fetchSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subscriptions) => {
          this.subscriptions = subscriptions;
        },
        error: (error) => {
          this.notificationService.showError('Error fetching subscriptions. Please try again later.');
        }
      });
  }

  onSubscribe(email: string): void {
    if (!this.isValidEmail(email)) {
      this.notificationService.showError('Please enter a valid email address.');
      return;
    }
  
    this.suscriberService.subscribeEmail(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Successfully subscribed to the newsletter!');
          this.fetchSubscriptions();
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Subscription failed. Please try again later.';
          this.notificationService.showError(errorMessage);
        }
      });
  }

  private isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }
}