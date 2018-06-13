import { MatDialogRef } from '@angular/material';
import { MyErrorStateMatcher } from './../../../app.component';
import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

/**
 * Forgot Dialog
 * Dialog Component for remember user
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'remember-dialog',
  templateUrl: './remember.dialog.html',
  styleUrls: ['./remember.dialog.css']
})
// tslint:disable-next-line:component-class-suffix
export class RememberDialog {
  /**
   * Form control to email input
   *
   * Check if email is an email
   */
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Constructor
   * @param dialogRef DialogReferenced
   */
  constructor(public dialogRef: MatDialogRef<RememberDialog>) {}

  /**
   * Function when user dismiss dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function when user clicks in send
   */
  onSendClick(): void {
    const email = this.emailControl.value;
    this.dialogRef.close(email);
  }
}
