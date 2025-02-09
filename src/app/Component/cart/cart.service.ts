import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartProduct } from './cart.component';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {
    this.updateCartCount();
  }

  updateCartCount() {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    this.cartItemCount.next(cart.length);
  }

  getCartCount() {
    return this.cartItemCount$;
  }
}