import { RememberDialog } from './../remember-dialog/remember.dialog';
import { LoginService } from './../../../shared/services/login.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MyErrorStateMatcher, alertify } from './../../../app.component';
import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

/**
 * Login Dialog
 * Dialog Component for login
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login-dialog',
  templateUrl: './login.dialog.html',
  styleUrls: ['./login.dialog.less']
})
// tslint:disable-next-line:component-class-suffix
export class LoginDialog {
  /**
   * Use if rememberAuth is called
   */
  email: string;

  /**
   * Form control to name input
   *
   * NamePattern is always begin with letter and can be letters and number with lenght between 6, 16
   */
  nameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{6,16}$')
  ]);
  /**
   * Form control to password input
   *
   * PassPattern is alphanumeric with lenght between 8, 64. In register, pass is encrypted with SHA-265
   */
  passControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Constructor
   * @param dialogRef DialogReferenced
   * @param dialog Dialog to forgotCredentials
   * @param loginService Service to login
   */
  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    public dialog: MatDialog,
    private loginService: LoginService
  ) {}

  /**
   * Function when user dismiss dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function when user clicks in login
   * Get values and emit (New form for Angular v7 without ngModel)
   */
  onLoginClick(): void {
    const data = {
      userN: this.nameControl.value,
      pass: this.passControl.value
    };

    this.dialogRef.close(data);
  }

  /**
   * Remember username and reset password, calls API with the service
   *
   * @param email {string} User's email to send user and password reset
   */
  rememberUser(email: string): void {
    this.loginService.rememberAuth(email).subscribe(
      response => {
        if (response) {
          alertify.success(
            document.getElementById('credentials').innerHTML + email
          );
          this.dialog.closeAll();
        }
      },
      error => {
        if (error != null) {
          alertify.error(document.getElementById('errEmailNot').innerHTML);
          this.dialog.closeAll();
        }
      }
    );
  }

  /**
   * Open Component ForgotDialog and handle the data when is closed
   *
   * With the user email, calls the function to remember user
   */
  openForgotDialog(): void {
    const dialogRef = this.dialog.open(RememberDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email !== '' && email !== undefined) {
        this.rememberUser(email);
      }
    });
  }
}
