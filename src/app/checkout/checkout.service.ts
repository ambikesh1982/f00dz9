import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';
import { IOrderState } from './checkout/checkout.component';
import { ICheckout } from '../app-cart/app-cart.model';

const ORDER_STATUS = {
  '00': 'Completed',
  '01': 'Awaiting_Confirmation',
  '02': 'Confirmed',
  '03': 'Partially_Confirmed',
  '04': 'Cancelled',
  '05': 'Rejected',
  '06': 'Timeout'
};

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  ordersColl: string;
  ordersCollRef: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.ordersColl = 'checkout';
    this.ordersCollRef = this.afs.collection(this.ordersColl);
   }

  ordersPlaced(id: string) {
    return this.afs.collection<ICheckout>(this.ordersColl, ref => ref.where('buyer.id', '==', id)).snapshotChanges();
  }

  ordersReceived(id: string) {
    return this.afs.collection<ICheckout>(this.ordersColl, ref => ref.where('seller.id', '==', id)).snapshotChanges();
  }

  ordersCompleted(id: string) {

  }

  ordersCancelled(id: string) {

  }

  deleteOrder(id: string) {
    this.ordersCollRef.doc(id).delete().then(
      resp => {
        console.log('Order removed from checkout: ', resp);
      }
    ).catch( e => console.log('Error while removing order from checkout: ', e));
  }

  updateOrderState(id: string, newState: IOrderState) {
    this.ordersCollRef.doc(id).update({currState: newState})
      .then(
        resp => {
          console.log('Order status updated: ', resp);
        }
      ).catch(e => console.log('Error while updating order status: ', e));
  }

  orderTimeout() {
    // TODO: If no response from Seller, orders can be auto cancel using TIMEOUT
    // Write cloud functions to auto cancel order (state = 'TIMEOUT')
    // Instant orders timeout after 2 hours.
    // PreOrders can be timeout after 1 day.
  }



}
