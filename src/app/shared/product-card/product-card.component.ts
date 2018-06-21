import { Component, Input } from '@angular/core';
import { Fooditem } from '../../core/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styles: []
})
export class ProductCardComponent {

  @Input() fooditem: Fooditem;

  constructor() { }

}
