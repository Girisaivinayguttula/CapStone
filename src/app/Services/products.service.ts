import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../Component/onlineshop/onlineshop.component';
import { OrdersComponent } from '../Component/orders/orders.component';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = "http://localhost:5000/api"
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl + '/products');
  }

  fetchOrders(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl + '/orders/email', { headers });
  }
}
