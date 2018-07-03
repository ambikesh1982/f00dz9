import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinct, first, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { AppUser, Fooditem } from '../core/models';



@Injectable({
  providedIn: 'root'
})
export class AppCartService {

  cartCollection: string;
  ordersSubCollection: string;
  itemSubCollection: string;
  getCartSize$ = new BehaviorSubject(0);
  itemsRef: any;
  currentUser: AppUser;
  cartSize: number;
  ordersCollRef;


  constructor(private afs: AngularFirestore, private auth: AuthService) {
    console.log('From cartservice constructor');

    this.cartCollection = 'appcart';
    this.ordersSubCollection = 'orders';
    this.itemSubCollection = 'items';

    this.auth.currUser$.pipe(
      switchMap((user: AppUser) => {
        if (user) {
          return this.getCartItems$(user.uid);
        } else { return of([]); }
      })
    ).subscribe(items => {
      console.log('Items in the cart >>>>: ', items);
      this.getCartSize$.next(items.length);
    },
      e => {
        console.log('error in checking cartSize: ', e);
      });
  }





  // 1. Check document existence for Cart, Order and item
  private cartExist(sellerID: string) {
    return this.afs
      .collection(this.cartCollection)
      .doc(sellerID)
      .valueChanges().pipe(
        first()
      ).toPromise();
  }

  private orderExist(buyerID: string, sellerID: string) {
    console.log('Check if orders collection has any docs.');
    return this.afs.collection(this.cartCollection)
      .doc(buyerID)
      .collection(this.ordersSubCollection)
      .doc(sellerID).valueChanges().pipe(
        first()
      ).toPromise();
  }

  private itemExist(buyerID: string, sellerID: string, itemID: string) {
    return this.afs
      .collection<ICartDoc>(this.cartCollection).doc(buyerID)
      .collection<ICartDoc>(this.ordersSubCollection).doc(sellerID)
      .collection<ICartItem>(this.itemSubCollection).doc(itemID)
      .valueChanges().pipe(
        first()
      ).toPromise();
  }


  private createNewCart(buyer: AppUser) {

    const newCart: ICartDoc = {
      id: buyer.uid,
      name: buyer.displayName,
      state: 'active',
      qty: 0,
      amtPayable: 0.0,
      discount: 0.0
    };

    const cartRef = this.afs.collection(this.cartCollection).doc(buyer.uid);

    cartRef.set(newCart)
      .then(() => console.log('Cart initialized!! ', newCart))
      .catch(e => console.log('Error during cart initialization!!! ', e));
  }

  initializeUserCart(seller: AppUser) {
    this.cartExist(seller.uid)
      .then(resp => {
        if (resp) {
          console.log('Cart already initialized for user: ', resp);
        } else {
          console.log('Initialize Cart: ', resp);
          this.createNewCart(seller);
        }
      })
      .catch(e => console.log('Error while checking cart existence!!! ', e));
  }

  addNewOrder(buyerID: string, seller: { id: string, name: string }) {
    const newOrder: ICartDoc = {
      id: seller.id,
      name: seller.name,
      state: 'request',
      qty: 0,
      amtPayable: 0.0,
      discount: 0.0
    };
    const orderRef = this.afs
      .collection(this.cartCollection)
      .doc(buyerID)
      .collection(this.ordersSubCollection)
      .doc(seller.id);

    orderRef.set(newOrder);
  }

  updateOrder(buyerID: string, seller: { id: string, name: string }) {
    const orderRef = this.afs
      .collection(this.cartCollection)
      .doc(buyerID)
      .collection(this.ordersSubCollection)
      .doc(seller.id);

    console.log('TODO: Update Order... ');
  }

  manageOrder(buyerID: string, seller: {id: string, name: string}) {

    this.orderExist(buyerID, seller.id)
      .then( resp => {
        if (resp) {
          console.log('Seller already present: ', resp);
          this.updateOrder(buyerID, { id: seller.id, name: seller.name });
        } else {
          console.log('Add seller to Orders collection...');
          this.addNewOrder(buyerID, { id: seller.id, name: seller.name});
        }
      });
   }

  manageAppCart(cartID: string, fooditem: Fooditem) {

    const cartItem: ICartItem = {
      id: fooditem.id,
      title: fooditem.title,
      url: fooditem.images[0].url,
      qty: 1,
      price: fooditem.price,
    };

    const itemRef = this.afs
      .collection('appcart')
      .doc(cartID)
      .collection('orders')
      .doc(fooditem.createdBy.id)
      .collection('items')
      .doc(fooditem.id);

      itemRef.valueChanges().pipe(
      first(),
      tap((item: ICartDoc) => {
        if (item) {
          console.log('Item already present in the cart. Increment the item counter: ', item.qty);
          this.updateItemQuantity(cartID, fooditem.id, item.qty + 1);
        } else {
          console.log('Item not present, adding it to the cart: ');
          this.addItemToTheCart(itemRef, cartItem);
        }
      })
    ).subscribe();
  }

  getCartItems$(cartID: string): Observable<ICartItem[]> {
    return this.afs
      .collection(this.cartCollection)
      .doc(cartID)
      .collection<ICartItem>(this.itemSubCollection)
      .valueChanges();
  }

  getDistinctSellers$(cartID: string) {
    return this.afs
      .collection(this.cartCollection)
      .doc<ICartDoc>(cartID)
      .collection<ICartDoc>(this.itemSubCollection)
      .valueChanges().pipe(
        flatMap(items => items),
        distinct(item => item.id),
        tap(() => console.log('#### User Cart change event ####'))
      );
  }

  getCartItemsBySeller$(cartID, sellerID: string) {
    return this.afs
      .collection(this.cartCollection)
      .doc<ICartDoc>(cartID)
      .collection<ICartItem>(this.itemSubCollection, ref => ref.where('seller.id', '==', sellerID))
      .valueChanges();
  }

  updateItemQuantity(cartID: string, itemID: string, count: number) {
    const itemPath = `${this.cartCollection}/${cartID}/${this.itemSubCollection}/${itemID}`;
    this.afs.doc(itemPath).update({ quantity: count }).then(() => {
      console.log('Item quantity updated');
    }).catch(e => {
      console.log('Error while updating item quantity: ', e);
    });
  }

  private addItemToTheCart(itemRef: any, item: ICartItem) {
    /*
    1. Add item to items subcollectioin
    2. Update seller doc in orders collection. Add sellerid, sellername, item, total price.
    3. Update buyers doc in Root collection. Add id, name, quantity, amount and discount
    */
    itemRef.set(item).then(() => {
      console.log('Fooditem added to the Cart');
    }).catch(e => {
      console.log('Error while adding item to the Cart: ', e);
    });
  }

  removeItemFromCart(cartID: string, itemID: string) {
    console.log('TODO: Remove item from the cart');
    const itemPath = `${this.cartCollection}/${cartID}/${this.itemSubCollection}/${itemID}`;
    this.afs.doc(itemPath).delete()
      .then(() => {
        console.log(itemID, ' deteled from the cart');
      }).catch(e => console.log('Error while updating item quantity: ', e));
  }

}
