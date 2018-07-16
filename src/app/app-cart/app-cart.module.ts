import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCartComponent } from './app-cart/app-cart.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { DialogCheckoutComponent } from './dialog-checkout/dialog-checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appCartRoutes: Routes = [
  {
    path: '',
    component: AppCartComponent,
    canActivate: [AuthGuard],
    data: { title: 'APP_CART_PAGE' }
  },
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(appCartRoutes),
  ],
  declarations: [AppCartComponent, CartListComponent, DialogCheckoutComponent],
  entryComponents: [DialogCheckoutComponent]
})
export class AppCartModule { }
