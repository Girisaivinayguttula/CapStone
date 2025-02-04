import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuscriberService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  fetchSubscriptions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/subscriptions`);
  }

  subscribeEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe`, { email });
  }

  getUserEmail(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user`, { headers });
  }
}
