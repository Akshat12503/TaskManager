import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Token exists, grant access to route
  }

  // No token found, kick user back to login pool
  router.navigate(['/login']);
  return false;
};