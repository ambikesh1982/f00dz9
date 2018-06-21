import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppShellComponent } from './app-shell/app-shell.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { LayoutService } from './core/layout.service';
import { DataService } from './core/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './core/auth.guard';
import { ProductResolver } from './core/product.resolver';
import { ScriptLoadService } from './core/script-load.service';
import { CanDeactivateGuard } from './core/can-deactivate-guard';
import { LocationService } from './core/location.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppShellComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'f00dz9'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    LayoutService,
    DataService,
    AuthGuard,
    ProductResolver,
    ScriptLoadService,
    LocationService,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
