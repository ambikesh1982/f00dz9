import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './search.component';
import { TrimpipePipe } from './trimpipe.pipe';

const appSearchRoutes: Routes = [
  { path: '', component: SearchComponent, data: {title: 'APP_SEARCH_PAGE'} }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forChild(appSearchRoutes),
    SharedModule
  ],
  declarations: [SearchComponent, TrimpipePipe]
})
export class AppSearchModule { }
