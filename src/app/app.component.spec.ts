import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { HomeComponent } from './Component/home/home.component';
import { FooterComponent } from './Component/footer/footer.component';
import { LoginComponent } from './Component/login/login.component';
import { SignupComponent } from './Component/signup/signup.component';
import { By } from '@angular/platform-browser';
import { appRoutes } from './app.routes'; // Import the routes

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(appRoutes), // Use your appRoutes here
        AppComponent,
        NavbarComponent,
        HomeComponent,
        FooterComponent,
        LoginComponent,
        SignupComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
    await router.navigate(['/home']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

it('should redirect to home for unknown routes', async () => {
  await router.navigate(['/unknown']);
  fixture.detectChanges();
  await fixture.whenStable();

  expect(router.url).toBe('/home');
});

it('should render home component on default route', async () => {
  await router.navigate(['/home']);
  fixture.detectChanges();
  await fixture.whenStable();

  const homeComponent = fixture.debugElement.query(By.directive(HomeComponent));
  expect(homeComponent).toBeTruthy();
});

});
