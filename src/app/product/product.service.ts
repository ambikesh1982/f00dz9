import { Injectable } from '@angular/core';
// Firebase imports
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
// rxjs imports
import { BehaviorSubject, Observable } from 'rxjs';
// local imports
import { AppUser, Fooditem } from '../core/models';





const APP_ROOT_COLLECTIONS = {
  'PRODUCTS': 'products',
  'USERS': 'appusers',
  'CHATS': 'appchats',
};

@Injectable()

export class ProductService {
  private appUserPath: string;
  private productlistPath: string;
  private appUserRef: AngularFirestoreCollection<AppUser>;
  private productlistRef: AngularFirestoreCollection<Fooditem>;
  FooditemID$: BehaviorSubject<string>;


  ccc: any;

  currentChatPath: any;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) {
    afs.firestore.settings({ timestampsInSnapshots: true });
    this.FooditemID$ = new BehaviorSubject(null);

    this.appUserPath = APP_ROOT_COLLECTIONS['USERS'];
    this.productlistPath = APP_ROOT_COLLECTIONS['PRODUCTS'];

    this.appUserRef = this.createFirestoreCollectionRef(APP_ROOT_COLLECTIONS['USERS']);
    this.productlistRef = this.createFirestoreCollectionRef(APP_ROOT_COLLECTIONS['PRODUCTS']);

  }

  // #### Generic method to create Collection references. ####

  createFirestoreCollectionRef(collectionPath: string): AngularFirestoreCollection<any> {
    return this.afs.collection<any>(collectionPath);
  }  // createFirestoreCollectionRef

  getFirebaseDocumentKey(): string {
    return this.afs.createId();
  }

  get serverTimestampFromFirestore() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  // #### product methods ####



  getProductList(): Observable<Fooditem[]> {
    this.productlistRef.ref.orderBy('createdAt', 'desc');
    return this.afs.collection<Fooditem>
      (APP_ROOT_COLLECTIONS['PRODUCTS'], ref => ref.orderBy('createdAt', 'desc')).valueChanges();
  }


  getProductByID(productId: string): Observable<Fooditem> {
    const productPath = `${this.productlistPath}/${productId}`;
    return this.afs.doc<Fooditem>(productPath).valueChanges();
  }

  // getProductsByUser(): Observable<Fooditem[]> {
  //   // TODO: Fetch the list of user uploads
  //   return of(Food);
  // }

  async createProduct(fooditem: Fooditem, docID: string) {
    const promise = this.productlistRef.doc(docID).set(fooditem);

    await promise.then(res => {
      console.log('New fooditem created!!');
    }, err => {
      console.log('Error during create fooditem: ', err);
    });

  }

  updateProduct(fooditem: Fooditem): Promise<any> {
    const productPath = `${this.productlistPath}/${fooditem.id}`;
    return this.afs.doc<Fooditem>(productPath).update(fooditem);
  }

  deleteProduct(productId: Fooditem): Promise<any> {
    const productPath = `${this.productlistPath}/${productId}`;
    return this.afs.doc<Fooditem>(productPath).delete();
  }

  // <Storage...>


  // </Storage...>



  // Chat Component Menthods Start

  // Chat Component Menthods Start


  // Chat Component Menthods Ends here

  // <AppUser...>

  getUserFromFirestore(uid: string) {
    const appUserPath = `${this.appUserPath}/${uid}`;
    return this.afs.doc<AppUser>(appUserPath).valueChanges();
  }

  async saveUserDataToFirestore(user: AppUser) {
    console.log('User dataservice: ', user);
    const promise = this.appUserRef.doc(user.uid).set(user);
    await promise.then(res => {
      console.log('saveUserDataToFirebase(user): ', user);
      console.log('New User Saved!!');
    }, err => {
      console.log('Error during create User: ', err);
    });
  }

  async updateUserData(uid: string, data: any) {
    // Sets user data to firestore on login
    const promise = this.appUserRef.doc(uid).update(data);
    await promise.then(
      res => {
        console.log('User data updated!!');
      }, err => {
        console.log('Error during update User: ', err);
      }
    );
  }


  deleteUser(uid: string) {
    // TODO: Delete user from firebase database.
    console.log('User deleted: ', uid);
  }

  // </AppUser...>

}
