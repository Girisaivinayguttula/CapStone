import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CartProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  totalAmount = 0;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartProducts = this.aggregateCartProducts(cart);
    this.calculateTotalAmount();
  }

  aggregateCartProducts(cart: any[]): CartProduct[] {
    const productMap = new Map<string, CartProduct>();

    cart.forEach(product => {
      if (productMap.has(product._id)) {
        const existingProduct = productMap.get(product._id)!;
        existingProduct.quantity += 1;
      } else {
        product.quantity = 1;
        productMap.set(product._id, product);
      }
    });

    return Array.from(productMap.values());
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  decreaseQuantity(product: CartProduct, event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      this.removeFromCart(product);
    }
    this.updateCart();
  }

  increaseQuantity(product: CartProduct, event: Event) {
    event.preventDefault(); // Prevent default anchor behavior
    product.quantity += 1;
    this.updateCart();
  }

  updateCart() {
    // Create a new array of products with updated quantities
    const updatedCart = this.cartProducts.flatMap(product => Array(product.quantity).fill(product));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.calculateTotalAmount(); // Recalculate the total after each update
  }

  removeFromCart(product: CartProduct) {
    this.cartProducts = this.cartProducts.filter(p => p._id !== product._id);
    this.updateCart();
  }

  checkout() {
    alert('Proceeding to checkout...');
  }
}
