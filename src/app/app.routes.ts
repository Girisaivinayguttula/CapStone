import { Routes } from '@angular/router';
import { HomeComponent } from './Component/home/home.component'; 
import { LoginComponent } from './Component/login/login.component'; 
import { SignupComponent } from './Component/signup/signup.component'; 
import { AboutusComponent } from './Component/aboutus/aboutus.component';
import { OnlineshopComponent } from './Component/onlineshop/onlineshop.component'; 
import { ProductComponent } from './Component/products/products.component';
import { CartComponent } from './Component/cart/cart.component';
import { adminGuard } from './guards/admin.guard'; 
import { ProfileComponent } from './Component/profile/profile.component';

export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'products', component: ProductComponent, canActivate: [adminGuard] },
  { path: 'onlineshop', component: OnlineshopComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home if no path is provided
  { path: '**', redirectTo: '/home' } // Redirect to home for any unknown paths
];
