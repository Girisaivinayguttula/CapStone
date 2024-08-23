import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineshopComponent } from './onlineshop.component';

describe('OnlineshopComponent', () => {
  let component: OnlineshopComponent;
  let fixture: ComponentFixture<OnlineshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
