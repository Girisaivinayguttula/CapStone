import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing'; // Add this import
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Mock HTTP requests
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common'; // Common directives

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule, // Add RouterTestingModule
        HttpClientTestingModule, // Mock HTTP requests
        FormsModule,
        CommonModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.user = { name: 'Test User', email: 'test@example.com' }; // Ensure user is defined
    fixture.detectChanges(); // Trigger change detection to update the view
    expect(component).toBeTruthy();
  });
});
