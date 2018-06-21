import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fooditem, AppUser } from '../../core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
// import { AppCartService } from '../../app-cart/app-cart.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  // fooditems$: Observable<Fooditem>; // To show more fooditems form the same user.
  fooditem: Fooditem;
  preview: string;
  fooditemImageCount: number;
  fabActionIcon: string;
  subscription: Subscription;


  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    // private cartService: AppCartService
  ) {
    this.fooditem = this.route.snapshot.data['product'];
  }

  ngOnInit() {

    if (this.auth.currAppUser) {
      console.log('User already unwrapped:', this.auth.currAppUser);
      this.setFabAction(this.auth.currAppUser.uid);
    } else {
      console.log('No unwrapped appUser, Subscribing and getting the user info');
      this.auth.currUser$.pipe(
        take(1)
      ).subscribe(user => {
        if (user) {
          this.setFabAction(user.uid);
        } else {
          this.setFabAction('nouser');
        }
      });
    }

    this.fooditemImageCount = this.fooditem.images.length;
    console.log('Fooditem from resolver: ', this.fooditem);
    this.preview = this.fooditem.images[0].url;

  }

  setFabAction(uid: string) {
    if (uid === this.fooditem.createdBy) {
      this.fabActionIcon = 'edit';
    } else {
      this.fabActionIcon = 'add';
    }
  }

  onClickFab(action: string) {
    switch (action) {
      case 'add':
        // this.cartService.manageAppCart(this.auth.currAppUser.uid, this.fooditem);
        this.router.navigate(['app-cart']);
        break;
      case 'edit':
        this.router.navigate(['manage', this.fooditem.id]);
        break;
      default:
        this.router.navigate(['app-cart']);
        this.fabActionIcon = 'add';
        break;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
