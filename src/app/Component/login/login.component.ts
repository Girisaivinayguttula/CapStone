import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../Services/login.service';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  user: any;
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  userEmail = localStorage.getItem('email')
  userPhone = localStorage.getItem('phone')

  private adminEmail = 'admin@gmail.com';
  private adminPassword = 'adminpass';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private loginservice: LoginService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.isAdminCredentials()) {
      this.loginAsAdmin();
    } else {
      this.loginservice.loginUser(this.loginData).subscribe({
        next: (response: any) => {
          this.handleLogin(response.token, response.isAdmin);
        },
        error: () => {
          alert('Login failed: Invalid email or password.');
        }
      });
    }
  }

  private isAdminCredentials(): boolean {
    return this.loginData.email === this.adminEmail && this.loginData.password === this.adminPassword;
  }

  private loginAsAdmin(): void {
    this.user = {
      name: 'Admin User',
      email: this.adminEmail,
      phone: '123-456-7890',
      gender: 'Male'
    };
    this.handleLogin('hardcoded-token', true);
  }


  handleLogin(token: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    this.isLoggedIn = true;
    this.getUserDetails();
    this.authService.updateAdminStatus();
    this.cd.detectChanges();
    // this.router.navigate(['/']).then(() => {
    //   window.location.reload();
    // });
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.loginservice.getUserDetails(token).subscribe({
      next: (data: any) => {
        this.user = data;
        this.commonService.updateData(this.user)
        localStorage.setItem("userId", data.id);
        localStorage.setItem("name", data.name)
        localStorage.setItem("email", data.email)
        localStorage.setItem("phone", data.phone)
      }
    });
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.user = null;
    this.cd.detectChanges();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
