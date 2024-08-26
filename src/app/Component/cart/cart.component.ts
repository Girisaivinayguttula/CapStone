import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: Products[] = [];

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartProducts = cart;
  }

  removeFromCart(product: Products) {
    this.cartProducts = this.cartProducts.filter(p => p._id !== product._id);
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }
}
