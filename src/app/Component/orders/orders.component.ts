import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../Services/products.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { SpinnerService } from '../../Services/spinner.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private productsService: ProductsService, private spinnerService: SpinnerService, private popupModalService: PopupModalService) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    this.spinnerService.show();
    this.productsService.fetchOrders(token).subscribe({
      next: (data: any[]) => {
        this.spinnerService.hide();
        this.orders = data;
      },
      error: () => {
        this.spinnerService.hide();
        this.popupModalService.show('Failed to fetch orders:');
      }
    });
  }
}
