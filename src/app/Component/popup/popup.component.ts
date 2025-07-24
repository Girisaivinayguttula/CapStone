import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { PopupModalService } from '../../Services/popup-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  popupService = inject(PopupModalService);
  private autoCloseSub: Subscription;

  constructor() {
    this.autoCloseSub = this.popupService.modalContent$.subscribe((content) => {
      if (content) {
        setTimeout(() => {
          this.popupService.hide();
        }, 4000);
      }
    });
  }

  ngOnDestroy() {
    this.autoCloseSub.unsubscribe();
  }

}
