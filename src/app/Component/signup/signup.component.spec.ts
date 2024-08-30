import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Add this if you use HttpClient

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent, // Import Standalone Component directly
        RouterTestingModule, // Import RouterTestingModule for router testing
        HttpClientTestingModule // Import HttpClientTestingModule for HTTP testing
      ],
      providers: [
        // Provide any additional services or mocks here if needed
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more test cases as needed
});
