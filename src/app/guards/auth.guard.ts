import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Imbes return false ra, i-return ang UrlTree
    // Kini mopugong sa 'Transition Aborted' error kay klaro ang redirection
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};