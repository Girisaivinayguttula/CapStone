import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../Component/onlineshop/onlineshop.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = environment.apiUrl;

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

  placeOrder(orderData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl + '/orders', orderData, { headers });
  }

  addProduct(product: Products): Observable<Products> {
    return this.http.post<Products>(this.apiUrl + '/products', product);
  }

  saveProduct(product: Products): Observable<Products> {
    return this.http.put<Products>(`${this.apiUrl}/products/${product._id}`, product);
  }
}
