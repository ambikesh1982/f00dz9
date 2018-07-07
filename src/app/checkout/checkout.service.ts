import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }

  getCheckedOutOrders(userID: string) {
    return this.afs.collection('checkout', ref => ref.where('cartID', '==', userID)).valueChanges();
  }

  getMyOrders(userID: string) {
    return this.afs.collection('checkout', ref => ref.where('orderID', '==', userID)).valueChanges();
  }

}
