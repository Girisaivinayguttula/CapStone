import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupModalService {
  private modalContentSubject = new BehaviorSubject<string | null>(null);
  modalContent$ = this.modalContentSubject.asObservable();

  constructor() { }

  show(content: string) {
    this.modalContentSubject.next(content);
  }

  hide() {
    this.modalContentSubject.next(null);
  }
}
