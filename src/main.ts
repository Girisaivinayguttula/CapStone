// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Note the correct import

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), // Use the correct route constant here
    provideHttpClient(), provideAnimationsAsync(),
  ],
}).catch(err => console.error(err));
