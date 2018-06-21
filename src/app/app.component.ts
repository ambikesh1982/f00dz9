import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './core/auth.service';
import { LayoutService } from './core/layout.service';
import { AppUser } from './core/models';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading">
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  title = '';
  loading: boolean;
  currentUser: Observable<AppUser>;
  subscription: Subscription;

  constructor(private router: Router, private layoutService: LayoutService, private auth: AuthService) {
    // this.auth.signOut();
    this.loading = true;

    this.subscription = router.events.subscribe(routerEvent => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: any): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }
    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  ngOnInit() {
  } // ngOnInit

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
