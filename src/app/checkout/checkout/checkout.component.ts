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

  CancellationReasons = {
    '0001': 'No_Response',
    '0002': 'Not_Interested',
    '0003': 'Better_Alternative',
    '0004': 'Poor_Ratings',
    '0005': 'Others',
    '1001': 'Out_Of_Stock',
    '1002': 'No_Delivery',
    '1003': 'Poor_Rating',
  };

  checkedoutOrders$: Observable<ICheckout[]>;
  receivedOrders$: Observable<ICheckout[]>;
  currentUser: any;
  // orderStates = ['Confirmed', 'Rejected', 'Partially Accepted'];

  constructor(
    public dialog: MatDialog,
    private checkoutService: CheckoutService,
    private auth: AuthService,
    private router: Router) {
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

  prepareOrderState(state: string, reason?: string, comments?: string ): IOrderState {
    return <IOrderState> {
      state: state,
      reason: reason || null,
      additionalComments: comments || null,
      updatedAt: new Date()
    };
  }

  confirmOrder(id: string) {
    const orderState = this.prepareOrderState('Confirmed');
    this.checkoutService.updateOrderState(id, orderState);
  }

  partiallyConfirmOrder(id: string) {
    const orderState = this.prepareOrderState('Partilly_Confirmed');
    this.checkoutService.updateOrderState(id, orderState);
  }

  deleteOrder(id: string) {
    console.log('TODO: Order cancelled by buyer. Delete order data: ', id);
    // this.checkoutService.deletePlacedOrder(id);
  }


  cancelOrder(id: string) {
    const dialogRef = this.dialog.open(DialogCancellationComponent, {
      data: <DialogData>{ userAction: 'CANCEL' }
    });

    dialogRef.afterClosed().subscribe((data: DialogData) => {
      if (data) {
        const orderState = this.prepareOrderState('Cancelled', data.reason, data.additionalComments);
        this.checkoutService.updateOrderState(id, orderState);
      } else {
        return;
      }
    });
  }

  rejectOrder(id: string) {
    const dialogRef = this.dialog.open(DialogCancellationComponent, {
      data: <DialogData>{ userAction: 'REJECT' }
    });

    dialogRef.afterClosed().subscribe((data: DialogData) => {
      if (data) {
        const orderState = this.prepareOrderState('Rejected', data.reason, data.additionalComments);
        this.checkoutService.updateOrderState(id, orderState);
      } else {
        return;
      }
    });
  }

  enableChat(id: string) {
    // Add conversation collection to checkout/id document.
    // Each message contains: sender name, msg, sent_at
    this.router.navigate(['chat', id]);
    console.log('TODO: Enable Chat for Chat Room: ', id);
  }

}
