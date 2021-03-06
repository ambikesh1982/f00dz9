import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fooditem } from './models';


@Injectable()
export class ProductService {

  products$: Observable<Fooditem[]>;
  // Filters....
  vegNonvetFilter$: BehaviorSubject<boolean|null>;
  cuisineFilter$: BehaviorSubject<string|null>;
  distanceFilter$: BehaviorSubject<number| null>;

  constructor( private firestore: AngularFirestore) {
    this.vegNonvetFilter$.next(null);
    this.cuisineFilter$.next(null);
    this.distanceFilter$.next(null);
    // this.getProducts();
   }

  //  getProducts() {
  //    this.products$ = combineLatest(
  //      this.distanceFilter$
  //    ).pipe(
  //      switchMap(distance =>
  //       this.firestore.collection('collection_path', ref => {
  //         let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
  //         if (distance) { query = query.where('distance', '==', distance); }
  //         return query;
  //       }).valueChanges()
  //      )
  //    );
  //  }

   filterByDistance(distance: number|null) {
    this.distanceFilter$.next(distance);
   }

}
