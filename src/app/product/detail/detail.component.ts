import { Component, OnInit, OnDestroy } from '@angular/core';
import { Fooditem, AppUser } from '../../core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AppCartService } from '../../app-cart/app-cart.service';

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
  currentUser: AppUser;


  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: AppCartService
  ) {
    this.currentUser = this.auth.currAppUser;
    this.fooditem = this.route.snapshot.data['product'];
    console.log('Fooditem from resolver: ', this.fooditem);
  }


  ngOnInit() {

    this.fooditemImageCount = this.fooditem.images.length;
    this.preview = this.fooditem.images[0].url;

    if (this.currentUser) {
      this.setFabAction(this.currentUser.uid);
    } else {
      this.setFabAction('nouser');
    }

  }

  setFabAction(uid: string) {
    if (uid === this.fooditem.createdBy.id) {
      this.fabActionIcon = 'edit';
    } else {
      this.fabActionIcon = 'add';
    }
  }

  onClickFab(action: string) {
    switch (action) {
      case 'add':
        this.cartService.manageProduct(this.auth.currAppUser.uid, this.fooditem);
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
    console.log('#### DetailComponent: Destroyed');
  }

}
