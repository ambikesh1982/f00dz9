import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { AppCartService } from '../app-cart.service';

@Component({
  selector: 'app-app-cart',
  templateUrl: './app-cart.component.html',
  styleUrls: ['./app-cart.component.scss']
})

export class AppCartComponent implements OnInit {

  cartID: string;
  orders$: Observable<ICartDoc[]>;

  constructor(
    public cartService: AppCartService,
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {
    this.cartID = this.auth.currAppUser.uid;
  }

  ngOnInit() {
    // Create Observable of all orders...
    this.orders$ = this.cartService.getAllOrders$(this.cartID);
  }

  updateOrder(order: { id: string, dataToUpdate: { qty: number, amtPayable: number}} ) {
    if (order.dataToUpdate.qty === 0) {
      this.cartService.removeOrder(this.cartID, order.id);
    } else {
      this.cartService.updateOrder(this.cartID, order.id, order.dataToUpdate);
    }
  }

  removeOrder(orderID: string) {
    // doc().delete() - Does not delete any nested collections.
    // First delete nested collection, and then delete the document.
    this.cartService.removeOrder(this.cartID, orderID);
  }

  navigateToChatRoute( sellerID: string) {
    console.log('navigateToChatRoute(sellerID): ', sellerID);
    console.log('navigateToChatRoute(buyerID): ', this.cartID);
  }

  fabAction(event) {
    if (event === 'add') {
      this.router.navigate(['/']);
    } else {
      console.log('TODO: Navigate to checkout component.');
    }
  }

  onClickCheckout(orderID: string) {
    this.cartService.checkoutOrder(this.cartID, orderID).subscribe(
      checkedoutOrder => {
        this.afs.collection('checkout').add(checkedoutOrder)
          .then( resp => {
            console.log('Order Checked out successfully');
            this.cartService.removeAllProducts(this.cartID, orderID)
              .then( reps => {
                this.cartService.removeOrder(this.cartID, orderID);
              });
            this.router.navigate(['/checkout']);
          })
          .catch( e => console.log('Error in order checkout: ', e));
      }
    );
  }

}
