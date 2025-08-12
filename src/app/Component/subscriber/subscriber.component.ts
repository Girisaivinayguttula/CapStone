import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../Services/login.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subscriber',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {
  private destroy$ = new Subject<void>();
  subscriptions: string[] = [];

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.fetchSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchSubscriptions() {
    this.loginService.getSuscribers().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.subscriptions = data;
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }
}
