import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { AppUser } from '../core/models';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {

  title = '';
  currentUser$: Observable<AppUser>;


  navList = [
    { menuIcon: 'home', menuName: 'Home', menuRoute: '/home' },
    { menuIcon: 'assignment', menuName: 'My Orders', menuRoute: '/checkout' },
    { menuIcon: 'shopping_cart', menuName: 'Cart', menuRoute: '/app-cart' },
    { menuIcon: 'favorite', menuName: 'Wish List', menuRoute: '/wishlist' },
    { menuIcon: 'account_circle', menuName: 'Profile', menuRoute: '/app-user' },
    { menuIcon: 'language', menuName: 'Language', menuRoute: './' },
    { menuIcon: 'android', menuName: 'Download App', menuRoute: './' },
    { menuIcon: 'help', menuName: 'Help', menuRoute: './' },
    { menuIcon: 'feedback', menuName: 'Feedback', menuRoute: './' },

  ];

  constructor( private auth: AuthService ) {
    this.currentUser$ = this.auth.currUser$.pipe(
      map(
        user => {
          if (user != null) {
            console.log('Logged-in user >>>> ', user);
            return user;
          } else {
            console.log('### User not found - Creating new anonymous user ###');
            // this.auth.loginAnonymously();
          }  // else
        }  // user
      )  // map
    ); // pipe
  }  // constructor



  ngOnInit() {

  } // ngOnInit


  loginAsGuest() {
    this.auth.loginAnonymously();
  }

  loginGoogle() {
    this.auth.loginGoogle();
  }

  signOut() {
    this.auth.signOut();
  }

}

