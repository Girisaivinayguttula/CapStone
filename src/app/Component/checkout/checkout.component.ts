import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;  // Optional field for image URL
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Import FormsModule for ngModel
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'] // Make sure the correct property is used (styleUrls)
})
export class CheckoutComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  totalAmount = 0;
  shippingCost = 5;
  selectedPaymentMethod = 'Card'; // Default payment method
  email = '';
  address = '';

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.loadCart();
    this.calculateTotalAmount();
    this.getUserEmail(); // Fetch user email
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartProducts = this.aggregateCartProducts(cart);
  }

  aggregateCartProducts(cart: any[]): CartProduct[] {
    const productMap = new Map<string, CartProduct>();

    cart.forEach(product => {
      if (productMap.has(product._id)) {
        const existingProduct = productMap.get(product._id)!;
        existingProduct.quantity += product.quantity;
      } else {
        productMap.set(product._id, {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          imageUrl: product.imageUrl
        });
      }
    });

    return Array.from(productMap.values());
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  getUserEmail() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<{ email: string }>('http://localhost:5000/api/user', { headers })
      .subscribe(
        (user) => {
          this.email = user.email; // Set the email input with the fetched user email
        },
        (error) => {
          console.error('Failed to fetch user details:', error);
        }
      );
  }

  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
  }

  onPay() {
    if (!this.email || !this.address) {
      alert('Email and address are required');
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

    console.log('Order Data:', orderData); // Log the order data to verify

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to place an order');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:5000/api/orders', orderData, { headers }).subscribe(
      response => {
        alert('Order placed successfully');
        localStorage.removeItem('cart');
      },
      error => {
        alert('Failed to place order');
        console.error('Error placing order:', error);
      }
    );
  }
}
