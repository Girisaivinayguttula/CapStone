import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing'; // Use RouterTestingModule for router-related testing
import { NavbarComponent } from '../navbar/navbar.component';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router'; // Import Router and ActivatedRoute from @angular/router
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule], // Use RouterTestingModule instead of RouterModule
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Mocking route parameters as an observable
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inject Router service
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo image', () => {
    const logo = fixture.debugElement.query(By.css('.logo'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('assests/images/logo.png');
  });

  it('should display the correct heading', () => {
    const heading = fixture.debugElement.query(By.css('h1')).nativeElement.textContent.trim();
    expect(heading).toBe('THE BEST THING YOU CAN FIND OUT THERE');
  });

  it('should display the correct paragraph text', () => {
    const paragraph = fixture.debugElement.query(By.css('p')).nativeElement.textContent.trim();
    expect(paragraph).toContain('Discover the finest cakes and bakery delights at our shop!');
  });

  // it('should navigate to /onlineshop when "Shop Now" button is clicked', () => {
  //   const navigateSpy = router.navigate as jasmine.Spy; 
  //   const button = fixture.debugElement.query(By.css('.shop-now-button')).nativeElement;
  //   button.click();
  //   fixture.detectChanges(); 

  //   expect(navigateSpy).toHaveBeenCalledWith(['/onlineshop']);
  // });

  it('should display the dish image', () => {
    const dishImage = fixture.debugElement.query(By.css('.image-content img'));
    expect(dishImage).toBeTruthy();
    expect(dishImage.nativeElement.src).toContain('assests/images/1.png');
  });
});
