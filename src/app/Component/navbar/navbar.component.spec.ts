import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth.service';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAdmin$: of(false) // Mock the AuthService with observable returning false
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the Products link if not an admin', () => {
    component.isAdmin = false;
    fixture.detectChanges();
    const productsLink = fixture.nativeElement.querySelector('a[routerLink="/products"]');
    expect(productsLink).toBeNull(); // Ensure Products link is not present
  });

  it('should display the Products link if an admin', () => {
    component.isAdmin = true;
    fixture.detectChanges();
    const productsLink = fixture.nativeElement.querySelector('a[routerLink="/products"]');
    expect(productsLink).not.toBeNull(); // Ensure Products link is present
  });

  it('should close the menu when a link is clicked', () => {
    spyOn(component, 'closeMenu'); // Spy on closeMenu method
    const link = fixture.nativeElement.querySelector('a[routerLink="/home"]');
    link.click();
    expect(component.closeMenu).toHaveBeenCalled(); // Ensure closeMenu is called
  });

  it('should correctly toggle the menu', () => {
    const checkbox = fixture.nativeElement.querySelector('#menu-toggle');
    checkbox.checked = true; // Simulate menu open
    fixture.detectChanges();
    expect(checkbox.checked).toBeTrue();

    component.closeMenu();
    fixture.detectChanges();
    expect(checkbox.checked).toBeFalse(); // Verify menu is closed
  });

  it('should call AuthService to get admin status', () => {
    spyOn(authService.isAdmin$, 'subscribe').and.callThrough(); // Spy on the subscribe method
    component.ngOnInit();
    expect(authService.isAdmin$.subscribe).toHaveBeenCalled(); // Ensure subscribe is called
  });

  it('should have profile and cart icons', () => {
    const profileIcon = fixture.nativeElement.querySelector('img.profile-icon');
    const cartIcon = fixture.nativeElement.querySelector('img.cart-icon');
    expect(profileIcon).not.toBeNull(); // Ensure profile icon is present
    expect(cartIcon).not.toBeNull(); // Ensure cart icon is present
  });
});
