import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../notification.service'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup;
  otpForm!: FormGroup;
  otpSent = false;
  otpVerificationFailed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['male']
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('[0-9]{6}')]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.notificationService.showError('Please fill in all required fields correctly.');
      return;
    }

    this.authService.signup(this.signupForm.value).subscribe(
      () => {
        this.otpSent = true;
        this.notificationService.showSuccess('OTP sent to your email. Please enter it to verify your account.');
      },
      error => {
        this.notificationService.showError('Signup failed. Please try again.');
      }
    );
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) {
      this.notificationService.showError('OTP must be exactly 6 digits.');
      return;
    }

    this.authService.verifyOtp(this.signupForm.value.email, this.otpForm.value.otp).subscribe(
      () => {
        this.notificationService.showSuccess('OTP verified! Redirecting to login page...');
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error => {
        this.notificationService.showError('Incorrect OTP. Please try again.');
        this.otpVerificationFailed = true;
      }
    );
  }
}
