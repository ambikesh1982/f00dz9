import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  paymentMethod: string;
  deliveryMethod: string;
}

@Component({
  selector: 'app-dialog-checkout',
  templateUrl: './dialog-checkout.component.html',
  styleUrls: ['./dialog-checkout.component.scss']
})
export class DialogCheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  dialogData: DialogData;




  constructor( @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    public dialogRef: MatDialogRef<DialogCheckoutComponent>,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit() {
  }

  createForm() {
    this.checkoutForm = this.fb.group({
      paymentMethod: ['cashOnDelivery', Validators.required], // raido button
      deliveryMethod: ['takeAway', Validators.required], // radio button
    });
  }

  prepareForm() {
    console.log('TODO: Payment and Delivery options');
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.dialogRef.close(this.checkoutForm.value);
  }

}
