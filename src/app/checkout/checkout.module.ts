import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { DialogCancellationComponent } from './dialog-cancellation/dialog-cancellation.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderlListComponent } from './orderl-list/orderl-list.component';

const appCheckoutRoutes: Routes = [
  { path: 'history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
    data: { title: 'ORDER_HISTORY'}
  },
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
    data: { title: 'APP_CHECKOUT_PAGE' }
  },
];


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(appCheckoutRoutes),
  ],
  declarations: [CheckoutComponent, DialogCancellationComponent, OrderHistoryComponent, OrderlListComponent],
  entryComponents: [DialogCancellationComponent]
})
export class CheckoutModule { }
