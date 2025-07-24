import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './Component/spinner/spinner.component';
import { SpinnerService } from './Services/spinner.service';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { FooterComponent } from './Component/footer/footer.component';
import { PopupComponent } from './Component/popup/popup.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    NavbarComponent,
    FooterComponent,
    PopupComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.spinnerService.loading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
