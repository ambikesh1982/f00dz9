import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  userAction: string;
  reason: string;
  additionalComments?: string;
}

@Component({
  selector: 'app-dialog-cancellation',
  templateUrl: './dialog-cancellation.component.html',
  styleUrls: ['./dialog-cancellation.component.scss']
})
export class DialogCancellationComponent implements OnInit {

  orderCancellationForm: FormGroup;
  dialogData: DialogData;

  constructor(@Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    public dialogRef: MatDialogRef<DialogCancellationComponent>,
    private fb: FormBuilder) {
      console.log('Data from Checkout-Component: ', data);
      this.createForm();
  }

  createForm() {
    this.orderCancellationForm = this.fb.group({
      cancellationReason: ['', Validators.required],
      cancellationMsg: null,
    });
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {

    this.dialogData = {
      userAction: this.data.userAction,
      reason: this.orderCancellationForm.value.cancellationReason,
      additionalComments: this.orderCancellationForm.value.cancellationMsg
    };

    this.dialogRef.close(this.dialogData);
  }

}
