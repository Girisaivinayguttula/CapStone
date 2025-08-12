import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(this.apiUrl + '/verify-otp', { email, otp });
  }

  loginUser(data: {}): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }

  getUserDetails(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl + '/user', { headers });
  }

  signUp(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/signUp', userData);
  }

  suscribeMail(email: string): Observable<any> {
    return this.http.post(this.apiUrl + '/subscribe', { email });
  }

  getSuscribers(): Observable<any> {
    return this.http.get(this.apiUrl + "/subscriptions")
  }
}
