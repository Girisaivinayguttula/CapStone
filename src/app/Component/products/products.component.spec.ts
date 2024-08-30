import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the modal when button is clicked', async () => {
    const button = fixture.nativeElement.querySelector('.add-product-button');
    expect(button).toBeTruthy(); // Ensure the button is in the DOM

    // Open modal
    button.click();
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for all asynchronous operations to complete

    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy(); // Ensure the modal is now in the DOM
    expect(component.showForm).toBeTrue(); // Verify component's state

    // Close modal
    const closeButton = modal.querySelector('.close');
    expect(closeButton).toBeTruthy(); // Ensure the close button is in the DOM
    closeButton.click();
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for all asynchronous operations to complete

    const closedModal = fixture.nativeElement.querySelector('.modal');
    expect(closedModal).toBeFalsy(); // Ensure the modal is no longer in the DOM
    expect(component.showForm).toBeFalse(); // Verify component's state
  });

});
