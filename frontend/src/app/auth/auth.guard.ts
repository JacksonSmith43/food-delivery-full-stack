import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const userEmail = sessionStorage.getItem('userEmail');

  if (userEmail) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }, // state is a RouterStateSnapshot object that contains the URL of the requested route. This allows the login page to redirect the user back to the originally requested page after a successful login.
  });
};
