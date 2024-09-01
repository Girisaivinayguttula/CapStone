import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let httpMock: HttpTestingController;
  let httpClientSpy: { post: jasmine.Spy; get: jasmine.Spy };

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        CheckoutComponent
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component and call ngOnInit', () => {
    spyOn(component, 'loadCart').and.callThrough();
    spyOn(component, 'calculateTotalAmount').and.callThrough();
    spyOn(component, 'getUserEmail').and.callThrough();

    component.ngOnInit(); // Explicitly call ngOnInit

    expect(component).toBeTruthy();
    expect(component.loadCart).toHaveBeenCalled();
    expect(component.calculateTotalAmount).toHaveBeenCalled();
    expect(component.getUserEmail).toHaveBeenCalled();
  });

  it('should place an order and clear cart', () => {
    const mockResponse = { success: true };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.address = '123 Street, City';
    component.cartProducts = [
      { _id: '1', name: 'Product 1', price: 10, quantity: 2, imageUrl: '' }
    ];
    component.totalAmount = 20;
    component.shippingCost = 5;

    spyOn(localStorage, 'getItem').and.returnValue('token123');
    spyOn(localStorage, 'removeItem');

    component.onPay();

    expect(httpClientSpy.post.calls.count()).toBe(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
  });
});
