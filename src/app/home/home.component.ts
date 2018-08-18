import { Component, OnInit } from '@angular/core';
import { first, map } from '../../../node_modules/rxjs/operators';
import { AuthService } from '../core/auth.service';
import { Router } from '../../../node_modules/@angular/router';
import { DataService } from '../core/data.service';
import { IGeoInfo } from '../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userId: string;
  geoInfo: IGeoInfo;

  constructor(private auth: AuthService, private router: Router, private dataServce: DataService) {
    this.userId = null;
  }

  ngOnInit() {

    this.auth.currUser$.pipe(first()).subscribe(
      user => {
        if (user) {
          console.log('User already loggedin.....', user.uid);
          this.userId = user.uid;
        } else {
          console.log('TODO: this.auth.loginAnonymously()');
          this.auth.loginAnonymously();
        }
      }
    );
  }

  geoInfoFromUser(event) {
    this.geoInfo = event;
    console.log('User location is: ', event);
  }


  navigateToList() {
    if (this.geoInfo) {
      this.dataServce.updateUserData(this.userId, {geoInfo: this.geoInfo});
      this.router.navigate(['/']);
    }
    console.log('TODO 1: save geoInfo: ', this.geoInfo);
    console.log('TODO 2: navigateToList(userId: string): ', this.userId);
  }
}
