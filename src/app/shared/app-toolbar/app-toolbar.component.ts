import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
// import { AppCartService } from '../../app-cart/app-cart.service';
import { AuthService } from '../../core/auth.service';
import { LayoutService } from '../../core/layout.service';



@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss']
})

export class AppToolbarComponent implements OnInit, OnChanges {

  @Input() sidenavRef: any;
  cartSize: number;
  hideCartBadge: boolean;

  constructor(
    // public cartService: AppCartService,
    public layoutService: LayoutService,
    private auth: AuthService,
    private location: Location,
  ) {
    // this.cartService.getCartSize$.subscribe(
    //   size => {
    //     this.cartSize = size;
    //     if (size > 0) {
    //       this.hideCartBadge = false;
    //     } else {
    //       this.hideCartBadge = true;
    //     }
    // });
  }

  ngOnInit() {}

  ngOnChanges() {

  }

  goBack() {
    this.location.back();
    console.log('triggered from goBack icon');
  }

}
