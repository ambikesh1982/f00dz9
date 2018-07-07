import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '', component: AppShellComponent, data: { title: 'APP_SHELL_PAGE' },
    children: [
      { path: 'app-cart', loadChildren: './app-cart/app-cart.module#AppCartModule' },
      { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule' },
      { path: 'chat', loadChildren: './app-chat/app-chat.module#AppChatModule' },
      { path: 'search', loadChildren: './app-search/app-search.module#AppSearchModule' },
      { path: 'app-user', loadChildren: './app-user/app-user.module#AppUserModule' },
      { path: '', loadChildren: './product/product.module#ProductModule' },

    ]
  },
  // { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'home', component: HomeComponent, data: { title: 'APP_HOME_PAGE' } },
  { path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInModule' },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, data: { title: 'PAGE_NOT_FOUND_PAGE' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes /*, {enableTracing: true}*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
