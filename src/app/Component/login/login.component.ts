import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../Services/login.service';
import { CommonService } from '../../Services/common.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { SpinnerService } from '../../Services/spinner.service';

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
  isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  private adminEmail = 'Admin';
  private adminPassword = 'AdminPass';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private loginservice: LoginService,
    private commonService: CommonService,
    private popupModalService: PopupModalService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.getUserDetails();
    }
  }

  onSubmit(): void {
    if (this.isAdminCredentials()) {
      this.loginAsAdmin();
    } else {
      this.spinnerService.show();
      this.loginservice.loginUser(this.loginData).subscribe({
        next: (response: any) => {
          this.spinnerService.hide();
          this.handleLogin(response.token, response.isAdmin);
        },
        error: () => {
          this.popupModalService.show("Invalid password");
          this.spinnerService.hide();
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
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    this.isLoggedIn = true;
    this.getUserDetails();
    this.authService.updateAdminStatus();
    this.cd.detectChanges();
  }

  getUserDetails() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    this.loginservice.getUserDetails(token).subscribe({
      next: (data: any) => {
        this.user = data;
        this.commonService.updateData(this.user)
        sessionStorage.setItem("userId", data._id);
        sessionStorage.setItem("name", data.name)
        sessionStorage.setItem("email", data.email)
        sessionStorage.setItem("phone", data.phone);
        this.cd.detectChanges();
      }
    });
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.user = null;
    this.cd.detectChanges();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
