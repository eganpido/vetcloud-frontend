import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Tugotan nga makasulod kay logged in man
  } else {
    // Kon wala ka-login, i-send sa login page
    router.navigate(['/login']);
    return false;
  }
};