import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { DataService } from './data.service';
import { Fooditem } from './models';


@Injectable()
export class ProductResolver implements Resolve<Fooditem> {

    constructor(
        private dataService: DataService,
        private router: Router) { }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<Fooditem> {
        const id = route.paramMap.get('id');
        return this.dataService.getProductByID(id).pipe(
            delay(2000), // added a delay to test loading spinner. To be removed later.
            take(1)
        );

           }
    }
