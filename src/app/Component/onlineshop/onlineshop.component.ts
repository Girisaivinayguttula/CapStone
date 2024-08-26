import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface Products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Products[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}
