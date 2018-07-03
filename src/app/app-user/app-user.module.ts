  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { AppUserComponent } from './app-user.component';
  import { Routes } from '@angular/router';
  import { RouterModule } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { MaterialModule } from '../material.module';
  import { FlexLayoutModule } from '@angular/flex-layout';

  const userRoute: Routes = [
    {
      path: '',
      component: AppUserComponent,
      data: { title: 'USER_PAGE' }
      // canActivate: [AuthGuard]
    } ];


  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      MaterialModule,
      FlexLayoutModule,
      RouterModule.forChild(userRoute)
    ],
    declarations: [AppUserComponent],
    // exports: [AppUserComponent]

  })
  export class AppUserModule { }
