import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';

const appCheckoutRoutes: Routes = [
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
    RouterModule.forChild(appCheckoutRoutes),
  ],
  declarations: [CheckoutComponent]
})
export class CheckoutModule { }
