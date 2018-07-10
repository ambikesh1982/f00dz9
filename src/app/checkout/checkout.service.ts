import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';

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
    return this.afs.collection(this.ordersColl, ref => ref.where('cartID', '==', id)).snapshotChanges();
  }

  ordersReceived(id: string) {
    return this.afs.collection(this.ordersColl, ref => ref.where('orderID', '==', id)).snapshotChanges();
  }

  deletePlacedOrder(id: string) {
    this.ordersCollRef.doc(id).delete().then(
      resp => {
        console.log('Order removed from checkout: ', resp);
      }
    ).catch( e => console.log('Error while removing order from checkout: ', e));
  }

  updateReceivedOrderState(id: string, newState: string) {
    this.ordersCollRef.doc(id).update({state: newState})
      .then(
        resp => {
          console.log('Order status updated: ', resp);
        }
      ).catch(e => console.log('Error while updating order status: ', e));
  }

}
