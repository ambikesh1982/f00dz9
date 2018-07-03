import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from '../core/data.service';
import { Fooditem } from '../core/models';

@Injectable()
export class ChatResolver implements Resolve<Fooditem> {

    constructor(private dataService: DataService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<Fooditem> {
        const id = route.paramMap.get('fid');
        return this.dataService.getProductByID(id).pipe(
            take(1)
        );
    }

}
