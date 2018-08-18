import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { AppUser } from '../core/models';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  currentUser$: Observable<AppUser>;
  returnURL: string;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentUser$ = this.auth.currUser$.pipe(
      map(
        user => {
          if (user != null) {
            console.log('Current User Logged-in user >>>> ', user);
            return user;
          } else {
            console.log('### User not found - Creating new anonymous user ###');
            // this.auth.loginAnonymously();
          }  // else
        }  // user
      )  // map
    ); // pipe
  }

  loginGoogle() {
    this.auth.loginGoogle().then(
      res => {
        this.router.navigateByUrl(this.returnURL);
      }
    );
  }

  loginAsGuest() {
    this.auth.loginAnonymously().then(
      res => {
        this.router.navigateByUrl(this.returnURL);
    });
  }

  signOut() {
    this.auth.signOut();
  }

  ngOnInit() {
    this.returnURL = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

}
