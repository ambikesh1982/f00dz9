import { Component, OnInit } from '@angular/core';
import { distinct, flatMap, map } from 'rxjs/operators';
import { DataService } from '../core/data.service';
import { Fooditem } from '../core/models';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  public cuisines: string[];

  locationFromNavigator: { lat: number, lng: number };

  constructor(
    private dataService: DataService) {
      this.cuisines = ['All Cuisines'];
      // Setting up default location
      this.locationFromNavigator = { lat: 1.3522174, lng: 103.87970299999999 };
   }

  ngOnInit() {
    // Get distinct cuisines
    this.dataService.getProductList().pipe(
      flatMap( (fooditems: Fooditem[]) => fooditems),
      map( fooditem => fooditem.cuisine),
      distinct(),
      // tap( fi => console.log(fi))
    ).subscribe(fi => {
      this.cuisines.push(fi);
    });

    // this.geoLocations$ = this.firestore.getProducts$(2);
  }

}
