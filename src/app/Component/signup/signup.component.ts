import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../Services/login.service';
import { PopupModalService } from '../../Services/popup-modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerService } from '../../Services/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignupComponent implements OnInit {
  combinedForm!: FormGroup;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private spinnerService: SpinnerService,
    private popupModalService: PopupModalService
  ) { }

  ngOnInit(): void {
    this.initiateForm();
  }

  private initiateForm(): void {
    this.combinedForm = this.fb.group({
      signup: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        gender: ['male']
      }),
      otpVerification: this.fb.group({
        otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      })
    });
  }

  onSubmit() {
    if (this.combinedForm.get('signup')?.invalid) {
      return;
    }

    this.spinnerService.show();
    this.loginService.signUp(this.combinedForm.get('signup')?.value).subscribe({
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
    if (this.combinedForm.get('otpVerification')?.invalid) {
      return;
    }

    const email = this.combinedForm.get('signup.email')?.value;
    const otp = this.combinedForm.get('otpVerification.otp')?.value;

    this.spinnerService.show();
    this.loginService.verifyOtp(email, otp).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.popupModalService.show('OTP verified! Redirecting to login page...');
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: () => {
        this.spinnerService.hide();
        this.popupModalService.show('Incorrect OTP. Please try again.');
      }
    });
  }
}
