import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.currUser$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
          if (!loggedIn) {
            console.log('Not LoggedIn: Redirecting to login page');
            // not logged in so redirect to login page with the
            // return url and return false.
            // This return url will be used in sign-in component to
            // come back to this guarded route.
            this.router.navigate(['sign-in'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        })
    );
  }
}
