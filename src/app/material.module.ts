import { NgModule } from '@angular/core';

import {
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule,
  MatToolbarModule,
  MAT_CHECKBOX_CLICK_ACTION
  // MatDialog,
  // MatDialogRef,
  // MatDialogModule
} from '@angular/material';

@NgModule({
  exports: [
    // CommonModule
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatToolbarModule
    // MatDialog,
    // MatDialogRef,
    // MatDialogModule
  ],
  declarations: [],
  // TODO: Customise default behavior of mat_check_box
  // providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' }]
})
export class MaterialModule { }
