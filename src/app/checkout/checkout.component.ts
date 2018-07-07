import { Component, OnInit } from '@angular/core';
import { CheckoutService } from './checkout.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkedoutOrders$: any;
  receivedOrders$: any;
  currentUser: any;
  // orderStates = ['Confirmed', 'Rejected', 'Partially Accepted'];

  constructor( private checkoutService: CheckoutService, private auth: AuthService) {
    this.currentUser = this.auth.currAppUser.uid;
   }

  ngOnInit() {
    this.checkedoutOrders$ = this.checkoutService.getCheckedOutOrders(this.currentUser);
    this.receivedOrders$ = this.checkoutService.getMyOrders(this.currentUser);
  }

}
