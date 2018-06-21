import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { DialogComponent } from '../shared/dialog/dialog.component';


@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }


  openDialog(dialogMsg: string): Observable<any> {

    const dialogConfig = new MatDialogConfig();

    // Disable user to escape or click outside to close dialog.
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Passing data to DialogComponent
    dialogConfig.data = { dialogMessage: dialogMsg };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    return dialogRef.afterClosed();
  }

}
