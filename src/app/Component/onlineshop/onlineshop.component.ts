import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-onlineshop',
  templateUrl: './onlineshop.component.html',
  styleUrls: ['./onlineshop.component.scss'],
})
export class OnlineshopComponent implements OnInit {
  products: Product[] = [];
  private apiUrl = 'http://localhost:5000/api/products'; // Ensure this URL matches your backend server

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return []; // Return an empty array if there's an error
      })
    ).subscribe((data: Product[]) => {
      console.log('Fetched products:', data); // Add this line to check the fetched products
      this.products = data;
    });
  }
}  
