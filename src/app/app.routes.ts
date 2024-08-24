import { Routes } from '@angular/router';
import { HomeComponent } from './Component/home/home.component'; 
import { LoginComponent } from './Component/login/login.component'; 
import { SignupComponent } from './Component/signup/signup.component'; 
import { EbooksComponent } from './Component/ebooks/ebooks.component'; 
import { AboutusComponent } from './Component/aboutus/aboutus.component';
import { ServicesComponent } from './Component/services/services.component'; 
import { OnlineshopComponent } from './Component/onlineshop/onlineshop.component'; 
import { ProductComponent } from './Component/products/products.component';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ebooks', component: EbooksComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'products', component: ProductComponent},
  { path: 'onlineshop', component: OnlineshopComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home if no path is provided
  { path: '**', redirectTo: '/home' } // Redirect to home for any unknown paths
];
