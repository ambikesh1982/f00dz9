import { Component, OnInit } from '@angular/core';
import { CheckoutService } from './checkout.service';
import { AuthService } from '../core/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkedoutOrders$: any;
  receivedOrders$: any;
  currentUser: any;
  // orderStates = ['Confirmed', 'Rejected', 'Partially Accepted'];

  constructor(private checkoutService: CheckoutService, private auth: AuthService) {
    this.currentUser = this.auth.currAppUser.uid;
  }

  ngOnInit() {
    this.checkedoutOrders$ = this.checkoutService.ordersPlaced(this.currentUser)
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        ));

    this.receivedOrders$ = this.checkoutService.ordersReceived(this.currentUser)
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        ));
  }

  deleteOrder(id: string) {
    console.log('TODO: Order cancelled by buyer. Delete order data: ', id);
    this.checkoutService.deletePlacedOrder(id);
  }

  cancelOrder(id: string) {
    this.checkoutService.updateReceivedOrderState(id, 'Cancelled');
  }

  confirmOrder(id: string) {
    this.checkoutService.updateReceivedOrderState(id, 'Confirmed');
  }

  partiallyConfirmOrder(id: string) {
    this.checkoutService.updateReceivedOrderState(id, 'Partially confirmed');
  }

}
