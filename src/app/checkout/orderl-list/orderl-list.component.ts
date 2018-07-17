import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ICheckout, IOrderState } from '../../app-cart/app-cart.model';
import { CheckoutService } from '../checkout.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogCancellationComponent, DialogData } from '../dialog-cancellation/dialog-cancellation.component';

@Component({
  selector: 'app-orderl-list',
  templateUrl: './orderl-list.component.html',
  styleUrls: ['./orderl-list.component.scss']
})
export class OrderlListComponent implements OnInit, OnChanges {

  @Input() orderList$: Observable<ICheckout[]>;
  @Input() orderType;

  buyerView: boolean;
  sellerView: boolean;

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

  constructor(public dialog: MatDialog,
    private checkoutService: CheckoutService,
    private router: Router) {
      this.buyerView = false;
      this.sellerView = false;
    }

  ngOnChanges() {
    if (this.orderType === 'placed') {
      this.buyerView = true;
    } else if (this.orderType === 'received') {
      this.sellerView = true;
    }
  }

  ngOnInit() {
  }

  prepareOrderState(state: string, reason?: string, comments?: string): IOrderState {
    return <IOrderState>{
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
