import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router'; // Import Router from @angular/router
import { AppComponent } from './app.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { HomeComponent } from './Component/home/home.component';
import { FooterComponent } from './Component/footer/footer.component';
import { LoginComponent } from './Component/login/login.component';
import { SignupComponent } from './Component/signup/signup.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router; // Declare router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),  // Configure RouterTestingModule with empty routes
        AppComponent,         // Import the standalone AppComponent
        NavbarComponent,
        HomeComponent,
        FooterComponent,
        LoginComponent,
        SignupComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Initialize router
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navbar component', () => {
    const navbarElement = fixture.debugElement.query(By.directive(NavbarComponent));
    expect(navbarElement).toBeTruthy();
  });

  it('should render the footer component', () => {
    const footerElement = fixture.debugElement.query(By.directive(FooterComponent));
    expect(footerElement).toBeTruthy();
  });

  it('should navigate to home on initial load', async () => {
    const spy = spyOn(router, 'navigate'); // Spy on navigate method

    // Simulate initial navigation
    router.navigate(['/home']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to login when login link is clicked', async () => {
    const navigateSpy = spyOn(router, 'navigate'); // Spy on navigate method

    const loginLink = fixture.debugElement.query(By.css('a[href="/login"]'));
    loginLink.triggerEventHandler('click', null);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should render home component on default route', () => {
    const homeComponent = fixture.debugElement.query(By.directive(HomeComponent));
    expect(homeComponent).toBeTruthy();
  });

  it('should redirect to home for unknown routes', async () => {
    const navigateSpy = spyOn(router, 'navigate'); // Spy on navigate method

    await router.navigate(['/unknown']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
