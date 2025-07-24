import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { LoginService } from '../../Services/login.service';
import { SpinnerService } from '../../Services/spinner.service';
import { PopupModalService } from '../../Services/popup-modal.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  userEmail: string = '';

  constructor(private commonService: CommonService, private loginService: LoginService, private spinnerService: SpinnerService, private popupModalService: PopupModalService) { }

  ngOnInit() {
    this.commonService.currentData.subscribe(data => {
      if (data) {
        this.userEmail = data.email;
      }
    })
  }

  onSubscribe(email: string) {
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    this.spinnerService.show();
    this.loginService.suscribeMail(this.userEmail)
      .subscribe({
        next: () => {
          this.spinnerService.hide();
          this.popupModalService.show('You are subscribed to the newsletter!');
        },
        error: (error) => {
          this.spinnerService.hide();
          this.popupModalService.show('There was an error subscribing to the newsletter. Please try again later.');
        }
      });
  }
}  