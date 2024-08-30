import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, HttpClientTestingModule, FormsModule, CommonModule], // Add HttpClientTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that there are no outstanding HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo image', () => {
    const logo = fixture.debugElement.query(By.css('.logoW'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('assests/images/logoW.png');
  });
});