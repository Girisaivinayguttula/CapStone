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
  imageUrl?: string; // Added this field to store image URLs
  rating?: number; // Added this field to manage star ratings
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Products[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          ...product,
          imageUrl: product.imageUrl || 'https://picsum.photos/200', // Default image fallback
          rating: product.rating || 4 // Default rating if not provided
        }));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  addToCart(product: Products) {
    if (!this.isLoggedIn()) {
      // Redirect to login page if user is not logged in
      this.router.navigate(['/login']);
      return;
    }

    // Save the product in localStorage or a service for now
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  starsArray(rating: number): number[] {
    return Array(rating).fill(1); // Creates an array to render the star icons
  }

  private isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
