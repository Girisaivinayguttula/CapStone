import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  rating?: number;
}

@Component({
  selector: 'app-onlineshop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onlineshop.component.html',
  styleUrls: ['./onlineshop.component.css']
})
export class OnlineshopComponent implements OnInit {
  products: Products[] = [];
  cartProducts: Set<string> = new Set();  // New property to track added products

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Products[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          imageUrl: product.imageUrl || 'https://picsum.photos/200',
          rating: product.rating || 4
        }));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  addToCart(product: Products) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Add product to cartProducts set to indicate it is added
    this.cartProducts.add(product._id || '');
  }

  isProductInCart(product: Products): boolean {
    return this.cartProducts.has(product._id || '');
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(1);
  }

  private isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
