import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div fxLayout="row wrap" fxLayout.xs="column">
      <mat-card>
        <mat-card-title> You landed up at unknown territori :(</mat-card-title>
        <br>
        <mat-card-title> Click <a routerLink="/">here</a> to reach home :)</mat-card-title>
      </mat-card>
    </div>
  `,
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
