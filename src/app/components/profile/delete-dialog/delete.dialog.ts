import { TranslateService } from '@ngx-translate/core';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';

/**
 * Delete Dialog
 * Dialog Component for Delete
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delete-dialog',
  templateUrl: './delete.dialog.html',
  styleUrls: ['./delete.dialog.less']
})
// tslint:disable-next-line:component-class-suffix
export class DeleteDialog {

  /**
   * Constructor
   * @param userService {UserService} Service to call users API
   * @param dialogRef DialogReferenced
   * @param dialog Dialog to forgotCredentials
   * @param router {Router} Used to implicitly navigate to a URL
   * @param loginService {LoginService} Service to call login API
   */
  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.use(localStorage.getItem('lang'));
  }

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
  onDeleteClick(): void {
    this.userService
      .deleteAccount(this.data.name, this.data.pass)
      .subscribe(response => {
        this.logout();
      });
    this.dialogRef.close();
  }

  /**
   * Sets user to null, call service to delete user's cookies and navigate to /intro
   */
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/intro']);
  }
}
