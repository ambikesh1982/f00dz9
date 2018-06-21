import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Fooditem } from '../../core/models';
import { DataService } from '../../core/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  fooditems: Observable<Fooditem[]>;

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
    // Unwrapped fooditems coming directly from route resolver.
    // See product.module.ts file.
    // this.fooditems = this.route.snapshot.data['products'];
    this.fooditems = this.dataService.getProductList();
  }

  navigateToSearchPage() {
    this.router.navigate(['search']);
  }
}
