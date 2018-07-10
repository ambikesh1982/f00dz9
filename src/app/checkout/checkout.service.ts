import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  ordersPlaced(id: string) {
    return this.afs.collection('checkout', ref => ref.where('cartID', '==', id)).snapshotChanges();
  }

  ordersReceived(id: string) {
    return this.afs.collection('checkout', ref => ref.where('orderID', '==', id)).snapshotChanges();
  }

  deletePlacedOrder(id: string) {
    this.afs.collection('checkout').doc(id).delete().then(
      resp => {
        console.log('Order removed from checkout: ', resp);
      }
    ).catch( e => console.log('Error while removing order from checkout: ', e));
  }

  updateReceivedOrderState(id: string, newState: string) {
    this.afs.collection('checkout').doc(id).update({state: newState})
      .then(
        resp => {
          console.log('Order status updated: ', resp);
        }
      ).catch(e => console.log('Error while updating order status: ', e));
  }

}
