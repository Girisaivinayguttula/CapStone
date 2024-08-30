import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineshopComponent } from './onlineshop.component';

describe('OnlineshopComponent', () => {
  let component: OnlineshopComponent;
  let fixture: ComponentFixture<OnlineshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineshopComponent, HttpClientTestingModule]  // Add HttpClientTestingModule here
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
