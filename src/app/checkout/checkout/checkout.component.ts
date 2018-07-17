import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { CheckoutService } from '../checkout.service';
import { DialogCancellationComponent, DialogData } from '../dialog-cancellation/dialog-cancellation.component';
import { ICheckout } from '../../app-cart/app-cart.model';
import { Observable } from 'rxjs';
import { Router } from '../../../../node_modules/@angular/router';

export interface IOrderState {
  state: string;
  updatedAt: Date;
  reason?: string;
  additionalComments?: string;
}


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})


export class CheckoutComponent implements OnInit {

  checkedoutOrders$: Observable<ICheckout[]>;
  receivedOrders$: Observable<ICheckout[]>;
  currentUser: any;
  // orderStates = ['Confirmed', 'Rejected', 'Partially Accepted'];

  constructor(
    public dialog: MatDialog,
    private checkoutService: CheckoutService,
    private auth: AuthService) {
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

}
