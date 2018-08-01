import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthSocialGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.currUser$.pipe(
      take(1),
      map(user => !user.isAnonymous),
      tap(socialUser => {
        console.log('socialUser?: ', socialUser);
        if (!socialUser) {
          console.log('Anonymous User : Redirecting to login page');
          // not logged in so redirect to login page with the
          // return url and return false.
          // This return url will be used in sign-in component to
          // come back to this guarded route.
          this.router.navigate(['sign-in'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );

    // console.log('x: ', x);

    // x.subscribe( xval => {
    //   console.log('xval: ', xval);
    // } );

    // return x;
  }
}
