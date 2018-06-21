import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';
import { DialogComponent } from './dialog/dialog.component';
import { FabActionComponent } from './fab-action/fab-action.component';
import { ProductCardComponent } from './product-card/product-card.component';

const SHARED_COMPONENTS = [
  AppToolbarComponent,
  FabActionComponent,
  ProductCardComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
  ],
  declarations: [
    AppToolbarComponent,
    FabActionComponent,
    ProductCardComponent,
    DialogComponent,
  ],
  exports: [
    SHARED_COMPONENTS
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
