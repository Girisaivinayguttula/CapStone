import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../Services/products.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { SpinnerService } from '../../Services/spinner.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private destroy$ = new Subject<void>();
  orders: any[] = [];
  token = sessionStorage.getItem('token');

  constructor(private productsService: ProductsService, private spinnerService: SpinnerService, private popupModalService: PopupModalService, private router: Router) { }

  ngOnInit() {
    this.fetchOrders();
    if (!this.token) {
      this.router.navigate(['/login']);
      this.popupModalService.show('Please log in to view your orders');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchOrders() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.spinnerService.show();
    this.productsService.fetchOrders(token).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any[]) => {
        this.spinnerService.hide();
        this.orders = data;
      },
      error: () => {
        this.spinnerService.hide();
        this.popupModalService.show('Failed to fetch orders');
      }
    });
  }
}
