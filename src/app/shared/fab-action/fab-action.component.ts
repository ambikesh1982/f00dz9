import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-fab-action',
  template: `
    <div>
            <button class="mat-elevation-z8" mat-fab (click)="fabActionEvent.emit(fabIcon);">
                <mat-icon>{{fabIcon}}</mat-icon>
            </button>
        </div>
  `,
  styles: []
})
export class FabActionComponent {

  @Input() fabIcon: string;
  @Output() fabActionEvent = new EventEmitter();

  constructor() {
  }

  onClickFab(data: string) {
    this.fabActionEvent.emit(data);
    console.log('onClickFab(): ', data);
  }

  // onClickFabButton(page: string) {
  //   switch (page) {
  //     case 'PRODUCT_LIST_PAGE':
  //       this.onClick_ListPage_Fab();
  //       break;
  //     case 'PRODUCT_DETAIL_PAGE':
  //       this.onClick_DetailPage_Fab();
  //       break;
  //     case 'PRODUCT_NEW_PAGE':
  //       // this.onClick_NewPage_Fab();
  //       break;
  //     case 'APP_CART_PAGE':
  //       this.onClick_CartPage_Fab();
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // onClick_ListPage_Fab() {
  //   this.router.navigate(['/search']);
  // }

  // onClick_DetailPage_Fab() {
  //   console.log('TODO: Setup DetailPage Action');
  // }

  // onClick_NewPage_Fab() {
  //   console.log('TODO: Setup NewPage Action');
  // }

  // onClick_CartPage_Fab() {
  //   console.log('TODO: Setup CartPage Action');
  // }

}
