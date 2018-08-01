import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AppCartService } from '../app-cart.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, tap, first } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AppUser } from '../../core/models';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit {
  order$: any;
  cartID: any;
  orderID: any;
  cart: { id: string; name: string };
  me: AppUser;

  constructor(
    private auth: AuthService,
    private cartService: AppCartService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.me = this.auth.currAppUser;
    this.cart = { id: this.me.uid, name: this.me.displayName };
    this.cartID = this.me.uid;
  }

  ngOnInit() {
    this.order$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.cartService.getOrdersById$(this.cartID, params.get('id'))
      )
    );
  }

  updateOrder(order: {
    id: string;
    dataToUpdate: { qty: number; amtPayable: number };
  }) {
    if (order.dataToUpdate.qty === 0) {
      this.cartService.removeOrder(this.cartID, order.id);
    } else {
      this.cartService.updateOrder(this.cartID, order.id, order.dataToUpdate);
    }
  }

  onClickCheckout(order) {
    this.cartService
      .checkoutOrder(
        this.cart,
        { id: order.id, name: order.name },
        order.paymentOption,
        order.deliveryOption
      )
      .pipe(
        first(),
        tap(checkedoutOrder => {
          this.afs
            .collection('checkout')
            .add(checkedoutOrder)
            .then(() => {
              console.log('Order Checked out successfully');
              this.cartService
                .removeAllProducts(this.cartID, order.id)
                .then(() => {
                  this.cartService.removeOrder(this.cartID, order.id);
                });
              this.router.navigate(['/checkout']);
            })
            .catch(e => console.log('Error in order checkout: ', e));
        })
      )
      .subscribe();
  }

  geoInfoFromUser(event) {
    console.log('geoInfoFromUser: ', event);
  }
}
