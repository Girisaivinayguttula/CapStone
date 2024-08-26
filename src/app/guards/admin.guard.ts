import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    router.navigate(['/home']); // Redirect non-admin users
    return false;
  }
  return true;
};
