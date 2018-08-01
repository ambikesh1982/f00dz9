import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { IGeoInfo } from '../core/models';
import { first, map } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userGeo: IGeoInfo;

  constructor(private auth: AuthService) {
    this.auth.afAuth.authState.pipe(first()).subscribe( user => {
      if (user) {
        console.log('User already loggedin.....', user);
      } else {
        this.auth.loginAnonymously();
      }
    });

    // this.auth.currUser$.pipe(
    //   first(),
    //   map( user => user.geoInfo)
    // ).subscribe( geo => {
    //   this.userGeo = geo;
    // });
   }

  geoInfoFromUser(event) {
    console.log('User location is: ', event);
  }

  ngOnInit() {
  }

}
