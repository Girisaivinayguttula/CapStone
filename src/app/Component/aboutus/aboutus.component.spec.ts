import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AboutusComponent } from './aboutus.component';

describe('AboutusComponent', () => {
  let component: AboutusComponent;
  let fixture: ComponentFixture<AboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusComponent] // Import the standalone component here
    }).compileComponents();

    fixture = TestBed.createComponent(AboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct heading text', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Associate Engineer At Ascendion»');
  });

  it('should display the correct subheading text', () => {
    const subheading = fixture.nativeElement.querySelector('h3');
    expect(subheading.textContent).toContain('About Giri Sai Vinay');
  });

  it('should display the correct paragraphs', () => {
    const paragraphs = fixture.nativeElement.querySelectorAll('p');
    expect(paragraphs.length).toBe(2); // Ensure there are exactly 2 paragraphs
    expect(paragraphs[0].textContent).toContain('Dans un cadre champêtre');
    expect(paragraphs[1].textContent).toContain('Au premier étage, aux côtés des cuisines');
  });

  it('should have a button with text "Read More"', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy(); // Ensure the button exists
    expect(button.textContent).toContain('Read More');
  });

  it('should display the image with correct src and alt attributes', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy(); // Ensure the image exists
    expect(img.src).toContain('assests/images/me.JPG'); // Ensure src is correct
    expect(img.alt).toBe('Guy Ravet'); // Ensure alt text is correct
  });

  it('should have a container with class "about-container"', () => {
    const container = fixture.debugElement.query(By.css('.about-container'));
    expect(container).toBeTruthy(); // Ensure container with class exists
  });

  it('should have an image container with class "about-image"', () => {
    const imageContainer = fixture.debugElement.query(By.css('.about-image'));
    expect(imageContainer).toBeTruthy(); // Ensure image container with class exists
  });

  it('should have a text container with class "about-text"', () => {
    const textContainer = fixture.debugElement.query(By.css('.about-text'));
    expect(textContainer).toBeTruthy(); // Ensure text container with class exists
  });
});
