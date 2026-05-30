import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Clone the request if a token is present to inject the Authorization header
  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pass the request forward and catch any incoming error responses
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the server rejected the token with a 401 Unauthorized state
      if (error.status === 401) {
        console.warn('Session expired or unauthorized. Logging out...');
        localStorage.removeItem('token'); // Clear the expired token cache
        router.navigate(['/login']); // Kick the user back to the login screen
      }
      return throwError(() => error);
    })
  );
};