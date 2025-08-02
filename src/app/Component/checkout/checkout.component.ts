import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../Services/products.service';
import { PopupModalService } from '../../Services/popup-modal.service';

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  totalAmount = 0;
  shippingCost = 5;
  selectedPaymentMethod = 'Card';
  email = sessionStorage.getItem("email") || '';
  address = '';

  constructor(private router: Router, private productService: ProductsService, private popupModalService: PopupModalService) { }

  ngOnInit() {
    this.loadCart();
    this.calculateTotalAmount();
  }

  loadCart() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.cartProducts = this.aggregateCartProducts(cart);
  }

  aggregateCartProducts(cart: any[]): CartProduct[] {
    const productMap = new Map<string, CartProduct>();

    cart.forEach(product => {
      if (productMap.has(product._id)) {
        const existingProduct = productMap.get(product._id)!;
        existingProduct.quantity += 1;
      } else {
        productMap.set(product._id, {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        });
      }
    });

    return Array.from(productMap.values());
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
  }

  onPay() {
    if (!this.email || !this.address) {
      this.popupModalService.show('Email and address are required');
      return;
    }

    const orderData = {
      email: this.email,
      address: this.address,
      paymentMethod: this.selectedPaymentMethod,
      cartProducts: this.cartProducts.map(product => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.imageUrl
      })),
      totalAmount: this.totalAmount,
      shippingCost: this.shippingCost
    };

    const token = sessionStorage.getItem('token');
    if (!token) {
      this.popupModalService.show('You must be logged in to place an order');
      return;
    }

    this.productService.placeOrder(orderData, token).subscribe(
      () => {
        this.popupModalService.show('Order placed successfully');
        sessionStorage.removeItem('cart');
        this.router.navigate(['/cart']);
      },
      () => {
        this.popupModalService.show('Failed to place order');
      }
    );
  }
}
