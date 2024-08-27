import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CartProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number; // Added quantity field
  imageUrl?: string; // Added optional imageUrl field
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
        existingProduct.quantity += 1; // Increase quantity if product already exists
      } else {
        product.quantity = 1; // Set quantity to 1 for new product
        productMap.set(product._id, product);
      }
    });

    return Array.from(productMap.values());
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  }

  removeFromCart(product: CartProduct) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter((p: CartProduct) => p._id !== product._id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.loadCart(); // Reload cart to reflect changes
  }

  decreaseQuantity(product: CartProduct) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.updateCart(product);
    } else {
      this.removeFromCart(product);
    }
  }

  increaseQuantity(product: CartProduct) {
    product.quantity += 1;
    this.updateCart(product);
  }

  updateCart(updatedProduct: CartProduct) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.map((product: CartProduct) => 
      product._id === updatedProduct._id ? updatedProduct : product
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.loadCart(); // Reload cart to reflect changes
  }

  checkout() {
    // Implement checkout logic
    alert('Proceeding to checkout...');
  }
}
