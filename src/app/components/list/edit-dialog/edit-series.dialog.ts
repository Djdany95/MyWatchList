import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MyErrorStateMatcher } from './../../../app.component';
import { FormControl, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';

/**
 * Edit Dialog
 * Dialog Component for edit series
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-series.dialog',
  templateUrl: './edit-series.dialog.html',
  styleUrls: ['./edit-series.dialog.css']
})
// tslint:disable-next-line:component-class-suffix
export class EditDialog {
  /**
   * Form controls to name
   *
   * Required
   */
  nameControl: FormControl = new FormControl(
    { value: this.data.s.name, disabled: true },
    [Validators.required]
  );
  /**
   * Form controls to season
   *
   * Required
   */
  tempControl: FormControl = new FormControl(this.data.s.temp, [
    Validators.required
  ]);
  /**
   * Form controls to episode
   *
   * Required
   */
  epaControl: FormControl = new FormControl(this.data.s.epA, [
    Validators.required
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Constructor
   * @param dialogRef DialogReferenced
   * @param data Data to save from the dialog
   */
  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Function when user dismiss dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function when user clicks in edit
   */
  onEditClick(): void {
    this.data.s.temp = this.tempControl.value;
    this.data.s.epA = this.epaControl.value;
    this.dialogRef.close(this.data);
  }
}
