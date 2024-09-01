import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterOutlet, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'male' // Default value
  };

  otp = ''; // New field to store OTP
  otpSent = false; // Track if OTP was sent
  otpVerificationFailed = false; // Track if OTP verification fails

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.isPasswordValid() || !this.isPhoneValid() || !this.user.name || !this.user.email) {
      // Do not proceed if validation fails; Angular will already handle this via the template
      return;
    }

    // If validation passes, send signup request
    this.http.post('http://localhost:5000/api/signup', this.user)
      .subscribe(
        response => {
          console.log('OTP sent successfully', response);
          this.otpSent = true; // OTP was sent successfully
          alert('OTP sent to your email. Please enter it to verify your account.');
        },
        error => {
          console.error('Error sending OTP', error);
          alert('Signup failed. Please try again.');
        }
      );
  }

  onVerifyOtp() {
    if (!this.isOtpValid()) {
      alert('OTP must be exactly 6 digits.');
      return;
    }

    this.http.post('http://localhost:5000/api/verify-otp', { email: this.user.email, otp: this.otp })
      .subscribe(
        response => {
          console.log('OTP verified successfully', response);
          alert('OTP verified! Redirecting to login page...');
          setTimeout(() => this.router.navigate(['/login']), 1000);
        },
        error => {
          console.error('Error verifying OTP', error);
          alert('Incorrect OTP. Please try again.');
          this.otpVerificationFailed = true;
        }
      );
  }

  isPasswordValid(): boolean {
    const password = this.user.password;
    return password.length >= 6;
  }
  
  isPhoneValid(): boolean {
    const phone = this.user.phone;
    return phone.length === 10 && /^[0-9]+$/.test(phone);
  }

  isOtpValid(): boolean {
    const otp = this.otp;
    return otp.length === 6 && /^[0-9]+$/.test(otp);
  }
}
