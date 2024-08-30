import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { of } from 'rxjs'; // Import `of` from RxJS

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let httpMock: HttpTestingController;
  let httpClientSpy: { post: jasmine.Spy }; // Spy object for HttpClient

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']); // Create spy object

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        CheckoutComponent
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy } // Provide spy object
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component and call ngOnInit', () => {
    spyOn(component, 'loadCart').and.callThrough();
    spyOn(component, 'calculateTotalAmount').and.callThrough();
    spyOn(component, 'getUserEmail').and.callThrough();

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.loadCart).toHaveBeenCalled();
    expect(component.calculateTotalAmount).toHaveBeenCalled();
    expect(component.getUserEmail).toHaveBeenCalled();
  });

  it('should load cart products and calculate total amount', () => {
    const cart = [
      { _id: '1', name: 'Product 1', price: 10, quantity: 2, imageUrl: '' },
      { _id: '2', name: 'Product 2', price: 20, quantity: 1, imageUrl: '' }
    ];

    // Mock localStorage.getItem
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(cart));

    // Spy on the calculateTotalAmount method to ensure it's called
    spyOn(component, 'calculateTotalAmount').and.callThrough();

    // Load cart products and calculate the total amount
    component.loadCart();
    fixture.detectChanges(); // Ensure the component reflects the changes

    // Calculate the total amount manually
    const expectedTotalAmount = 10 * 2 + 20 * 1;

    // Verify that the cart products are loaded correctly
    expect(component.cartProducts.length).toBe(2);

    // Verify that the total amount is calculated correctly
    expect(component.totalAmount).toBe(expectedTotalAmount);
  });

  it('should update the selected payment method', () => {
    component.onPaymentMethodChange('UPI');
    expect(component.selectedPaymentMethod).toBe('UPI');

    component.onPaymentMethodChange('Card');
    expect(component.selectedPaymentMethod).toBe('Card');
  });

  it('should place an order and clear the cart on success', () => {
    spyOn(component, 'onPay').and.callThrough();
    spyOn(localStorage, 'getItem').and.returnValue('token');
    const postResponse = of({}); // Use `of` to mock observable response
    httpClientSpy.post.and.returnValue(postResponse);
    spyOn(localStorage, 'removeItem').and.callThrough();

    component.email = 'test@example.com';
    component.address = '123 Test St';
    component.onPay();

    expect(component.onPay).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
  });

  it('should alert if email or address is missing during payment', () => {
    spyOn(window, 'alert');
    component.email = '';
    component.address = '';
    component.onPay();
    expect(window.alert).toHaveBeenCalledWith('Email and address are required');
  });
});
