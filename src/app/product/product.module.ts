import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { CanDeactivateGuard } from '../core/can-deactivate-guard';
import { ProductResolver } from '../core/product.resolver';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { AutoAddressComponent } from './manage/auto-address/auto-address.component';
import { ImageUploadComponent } from './manage/image-upload/image-upload.component';
import { ManageComponent } from './manage/manage.component';
import { Form1Component } from './manage/product-form/form1/form1.component';
import { Form2Component } from './manage/product-form/form2/form2.component';
import { DialogService } from '../core/dialog.service';
import { AuthSocialGuard } from '../core/auth-social.guard';


const productRoutes: Routes = [
  {
    path: 'manage/:id',
    component: ManageComponent,
    data: { title: 'PRODUCT_MANAGE_PAGE' },
    resolve: { product: ProductResolver },
    canActivate: [AuthSocialGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    data: { title: 'PRODUCT_DETAIL_PAGE' },
    resolve: { product: ProductResolver },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ListComponent,
    data: { title: 'PRODUCT_LIST_PAGE' },
    canActivate: [AuthGuard]
    // resolve: { products: ProductListResolver}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(productRoutes)
  ],
  providers: [DialogService],
  declarations: [
    DetailComponent,
    ListComponent,
    ManageComponent,
      ImageUploadComponent,
      AutoAddressComponent,
      Form2Component,
      Form1Component]
})

export class ProductModule { }
