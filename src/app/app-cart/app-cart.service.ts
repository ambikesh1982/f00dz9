import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, switchMap, tap, map, flatMap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { AppUser, Fooditem } from '../core/models';
import { ICartDoc, ICartItem, ICheckout } from './app-cart.model';

@Injectable({
  providedIn: 'root'
})

export class AppCartService {

  cartColl: string;
  orderSubColl: string;
  itemSubColl: string;

  currentUser: AppUser;

  getCartSize$ = new BehaviorSubject(0);

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.cartColl = 'appcart';
    this.orderSubColl = 'orders';
    this.itemSubColl = 'items';

    // this.auth.currUser$.subscribe(user => {
    //   if (user) {
    //     console.log('AppCartService: CurrentUser: ', user);
    //   } else {
    //     console.log('AppCartService: CurrentUser: ', user);
    //   }
    // });

    this.auth.currUser$.pipe(
      switchMap((user: AppUser) => {
        if (user) {
          return this.getAllOrders$(user.uid);
        } else { return of([]); }
      })
    ).subscribe(orders => {
      const orderItemsCount = orders.reduce((t, i) => t + i.qty, 0);
      this.getCartSize$.next(orderItemsCount);
    },
      e => {
        console.log('error in checking cartSize: ', e);
      });


  } // constructor

  getAllOrders$(cartID: string): Observable<ICartDoc[]> {
    return this.afs.collection(this.cartColl).doc(cartID).collection<ICartDoc>(this.orderSubColl).valueChanges();
  }

  getAllItems$(cartID: string, orderID: string): Observable<ICartItem[]> {
    return this.afs
      .collection(this.cartColl).doc(cartID)
      .collection<ICartDoc>(this.orderSubColl).doc(orderID)
      .collection<ICartItem>(this.itemSubColl).valueChanges();
  }


  productExist(productDocRef: AngularFirestoreDocument<ICartItem>): Promise<{}> {
    return productDocRef.valueChanges().pipe(first()).toPromise();
  }

  addProduct(productDocRef: AngularFirestoreDocument<ICartItem>, product: Fooditem) {
    const item: ICartItem = {
      id: product.id,
      title: product.title,
      url: product.images[0].url,
      qty: 1,
      price: product.price,
    };

    productDocRef.set(item).then(resp => {
      console.log('1.1: Product added to the cart: ', resp);
    }).catch(e => console.log('1.1: Error while adding product: ', e));
  }

  updateProduct(cartID: string, orderID: string, itemID: string, data: {}) {
    const productRef = this.afs.collection(this.cartColl).doc(cartID)
      .collection(this.orderSubColl).doc(orderID)
      .collection(this.itemSubColl).doc(itemID);

    productRef.update(data).then(() => {
      console.log('Item updated');
    }).catch(e => {
      console.log('Error while updating the item: ', e);
    });
   }

  removeProduct(cartID: string, orderID: string, itemID: string) {
    const productRef = this.afs.collection(this.cartColl).doc(cartID)
      .collection(this.orderSubColl).doc(orderID)
      .collection(this.itemSubColl).doc(itemID);

    productRef.delete().then(() => {
      console.log('Item Removed');
    }).catch(e => {
      console.log('Error while removing the item: ', e);
    });
  }

  removeAllProducts(cartID: string, orderID: string) {
    const itemsCollRef = this.afs.collection(this.cartColl).doc(cartID)
      .collection(this.orderSubColl).doc(orderID)
      .collection(this.itemSubColl);

      return itemsCollRef.valueChanges().pipe(
        first(),
        tap(items => {
          items.forEach( item => {
            itemsCollRef.doc(item.id).delete();
          });
        })
      ).toPromise();
  }

  manageProduct(buyerID: string, product: Fooditem) {
    const orderID = product.createdBy.id;
    const productID = product.id;

    const orederDocRef = this.afs.collection(this.cartColl).doc(buyerID)
      .collection(this.orderSubColl).doc<ICartDoc>(orderID);

    const productDocRef = this.afs.collection(this.cartColl).doc(buyerID)
      .collection(this.orderSubColl).doc(orderID)
      .collection(this.itemSubColl).doc<ICartItem>(productID);

    this.productExist(productDocRef).then((resp: ICartItem) => {
      if (resp) {
        console.log('>>> Product present: UPDATE PRODUCT: ', resp);
        const updatedQty = resp.qty + 1;
        this.updateProduct(buyerID, orderID, productID, {qty: updatedQty});
      } else {
        console.log('>>> Product not prsent: ADD PRODUCT: ');
        this.addProduct(productDocRef, product);
        this.orderExist(orederDocRef).then(orderResp => {
          if (!orderResp) {
            console.log('>>> Order not present. ADD ORDER: ');
            this.addOrder(orederDocRef, product);
          }
        });
      }
    }).catch(e => console.log('1.1: Error while checking product existence: ', e));
  }

  orderExist(orderDocRef: AngularFirestoreDocument<{}>): Promise<{}> {
    // console.log('1: Check product existence-returm promise.');
    return orderDocRef.valueChanges().pipe(first()).toPromise();
  }

  addOrder(orderDocRef: AngularFirestoreDocument<ICartDoc>, product: Fooditem) {
    const order: ICartDoc = {
      id: product.createdBy.id,
      name: product.createdBy.name,
      state: 'Pending',
      qty: 1,
      amtPayable: product.price,
      discount: 0
    };

    orderDocRef.set(order).then(resp => {
      console.log('>>> Order added to the cart: ', resp);
    }).catch(e => console.log('1.1: Error while adding product: ', e));
  }

  updateOrder(cartID: string, orderID: string, data: {}) {
    const orderRef = this.afs.collection(this.cartColl).doc(cartID)
      .collection(this.orderSubColl).doc(orderID);

    orderRef.update(data).then(() => {
      console.log('Order updated');
    }).catch(e => {
      console.log('Error while updating the Order: ', e);
    });
  }

  removeOrder(cartID: string, orderID: string) {
    const orderRef = this.afs.collection(this.cartColl).doc(cartID)
      .collection(this.orderSubColl).doc(orderID);

    orderRef.delete().then(() => {
      console.log('Order Removed!!');
    }).catch(e => {
      console.log('Error while removing the order document: ', e);
    });
  }

  checkoutOrder(buyer: { id: string, name: string }, seller: { id: string, name: string}, paymentMethod: string, deliveryMethod: string) {
    return this.afs.collection(this.cartColl).doc(buyer.id)
      .collection(this.orderSubColl).doc(seller.id)
      .collection(this.itemSubColl).valueChanges().pipe(
        first(),
        map( items => {
          const checkedoutOrder = <ICheckout>{
            buyer: buyer,
            seller: seller,
            currState: {state: 'Awaiting_Confirmation'},
            paymentOption: paymentMethod,
            deliveryOption: deliveryMethod,
            items: items,
            checkedOutAt: new Date()
          };
          return checkedoutOrder;
        } )
      );
  }


}



/*   constructor(private afs: AngularFirestore, private auth: AuthService) {
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
  } */
