import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppCartService } from '../app-cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  items$: Observable<ICartItem[]>;
  @Input() cartID: string;
  @Input() orderID: string;
  @Output() orderUpdate = new EventEmitter<{}>();

  constructor(private cartService: AppCartService) {
   }

  ngOnInit() {
    this.items$ = this.cartService.getAllItems$(this.cartID, this.orderID).pipe(
      tap( resp => {
        const orderItemsCount = resp.reduce( (t, i) => t + i.qty, 0);
        const orderValue = resp.reduce((t, i) => t + (i.price * i.qty), 0);
        const orderDataToUpdate = { qty: orderItemsCount, amtPayable: orderValue };
        this.orderUpdate.emit({id: this.orderID, dataToUpdate: orderDataToUpdate});
      })
    );
  }

  updateQty(item: ICartItem, count: number) {
    const updatedQty = item.qty + count;
    if ( updatedQty !== 0 ) {
      this.cartService.updateProduct(this.cartID, this.orderID, item.id, { qty: updatedQty });
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: ICartItem) {
    this.cartService.removeProduct(this.cartID, this.orderID, item.id);
    }

}
