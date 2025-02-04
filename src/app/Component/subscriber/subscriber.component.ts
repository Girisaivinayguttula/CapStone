import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuscriberService } from './suscriber.service';

@Component({
  selector: 'app-subscriber',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {
  subscriptions: string[] = [];

  constructor(private suscriberService: SuscriberService) {}

  ngOnInit() {
    this.fetchSubscriptions();
  }

  fetchSubscriptions() {
    this.suscriberService.fetchSubscriptions().subscribe(
      (data: string[]) => {
        this.subscriptions = data;
      },
      (error: any) => {
        console.error('Error fetching subscriptions:', error);
      }
    );
  }
}
