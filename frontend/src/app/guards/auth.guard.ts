import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Auth guard - protects routes from unauthorized access.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
