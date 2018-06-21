import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

// 1) [mat-dialog-close]: Dialog open and close methonds are directly implemeted in template
//  using [mat-dialog-close] directive
// 2) User defined methods: Alternatively you can create dialogReg and implement
// closeWithoutResponse() and
// closeWithResponse() methods.

export class DialogComponent implements OnInit {

  dialogMessage: any;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogMessage = data.dialogMessage;
    console.log('MAT_DIALOG_DATA from parent: ', data);
  }


  ngOnInit() {
  }

  // 2) User defined methods

  closeWithoutResponse() {
    this.dialogRef.close(false);
  }

  closeWithResponse() {
    this.dialogRef.close(true);
  }
}
