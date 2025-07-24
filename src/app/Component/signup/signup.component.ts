import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { SpinnerService } from '../../Services/spinner.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'male'
  };

  otp = '';
  otpSent = false;
  otpVerificationFailed = false;

  constructor(private router: Router, private loginservice: LoginService, private spinnerService: SpinnerService, private popupModalService: PopupModalService) { }

  onSubmit() {
    if (!this.isPasswordValid() || !this.isPhoneValid() || !this.user.name || !this.user.email) {
      return;
    }
    this.spinnerService.show();
    this.loginservice.signUp(this.user).subscribe({
      next: () => {
        this.otpSent = true;
        this.spinnerService.hide();
        this.popupModalService.show('OTP sent to your email. Please enter it to verify your account.');
      },
      error: () => {
        this.spinnerService.hide();
        this.popupModalService.show('Signup failed. Please try again.');
      }
    });
  }

  onVerifyOtp() {
    if (!this.isOtpValid()) {
      alert('OTP must be exactly 6 digits.');
      return;
    }
    this.spinnerService.show();
    this.loginservice.verifyOtp(this.user.email, this.otp).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.popupModalService.show('OTP verified! Redirecting to login page...');
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: () => {
        this.spinnerService.hide();
        this.otpVerificationFailed = true;
        this.popupModalService.show('Incorrect OTP. Please try again.');
      }
    });
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
