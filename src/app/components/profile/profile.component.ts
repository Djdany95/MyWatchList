import { MatSnackBar, MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { LoginService } from '../../shared/services/login.service';
import { UserService } from '../../shared/services/user.service';

import { User } from '../../shared/models/user';

import { MyErrorStateMatcher } from '../../app.component';

import * as sha256 from 'fast-sha256';
import { DeleteDialog } from './delete-dialog/delete.dialog';

/**
 * Profile Component
 * Shows the user's Profile
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  /**
   * Form controls to pass
   *
   * Required and pass pattern
   */
  oldPassControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Form controls to pass
   *
   * Required and pass pattern
   */
  newPassControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Used to get the user preference for nightMode
   */
  nightMode: string;

  /**
   * Used to get the user logged
   */
  user: User;

  /**
   * Number of series the user is following
   */
  nSeries: number;

  image: string;
  imageBase64: string;

  /**
   * Constructor
   * @param userService {UserService} Service to call users API
   * @param loginService {LoginService} Service to call login API
   * @param router {Router} Used to implicitly navigate to a URL
   * @param titleService {Title} Service to change the web Title
   */
  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private titleService: Title,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /**
   * We set various parameters to default, check if there are cookies of user logged and if nightMode is setted in storage before.
   * If there aren't cookies, does logout
   */
  ngOnInit() {
    if (
      localStorage.getItem('myUserName') === null &&
      sessionStorage.getItem('myUserName') === null
    ) {
      this.logout();
    }

    this.user = this.setUser();
    this.titleService.setTitle(
      this.user.name.charAt(0).toUpperCase() + this.user.name.slice(1)
    );
    this.getNightMode();
  }

  /**
   * Get user logged from cookies
   */
  setUser(): User {
    if (localStorage.getItem('myUserName') !== null) {
      this.nSeries = Number.parseInt(localStorage.getItem('myNSeries'), 10);
      return new User(
        localStorage.getItem('myUserName'),
        localStorage.getItem('myUserPass'),
        localStorage.getItem('myEmail'),
        localStorage.getItem('myPic')
      );
    } else {
      this.nSeries = Number.parseInt(sessionStorage.getItem('myNSeries'), 10);
      return new User(
        sessionStorage.getItem('myUserName'),
        sessionStorage.getItem('myUserPass'),
        sessionStorage.getItem('myEmail'),
        sessionStorage.getItem('myPic')
      );
    }
  }

  /**
   * Get user nightMode preference from localStorage
   */
  getNightMode(): void {
    if (localStorage.getItem('nightMode') === null) {
      localStorage.setItem('nightMode', 'false');
    }
    this.setBodyNightMode();
  }

  /**
   * Set nightMode if it's true, dayMode if it's false
   */
  setBodyNightMode(): void {
    if (localStorage.getItem('nightMode') === 'true') {
      this.nightMode = 'true';
      document.body.style.backgroundColor = '#142635';
      document.body.style.color = '#bdc7c1';
    } else {
      this.nightMode = 'false';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }

  /**
   * Call API to delete user account
   */
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '320px',
      panelClass: this.nightMode === 'true' ? 'nightMode' : '',
      data: { name: this.user.name, pass: this.user.pass }
    });
  }

  /**
   * Call the API to change Pass
   */
  changePass(): void {
    this.userService
      .changePass(
        this.user.name,
        String(sha256.hash(this.oldPassControl.value)),
        String(sha256.hash(this.newPassControl.value))
      )
      .subscribe(
        response => {
          this.openSnackBar('Password changed.', 'snackSuccess');
        },
        error => {
          if (error !== null) {
            this.openSnackBar('Password is incorrect.', 'snackError');
          }
        }
      );
  }

  /**
   * Call the API to change profileImage
   */
  generateBase64(event: any): void {
    const reader = new FileReader();
    reader.onload = (loadEvent: any) => {
      this.image = loadEvent.target.result;
      this.imageBase64 = this.image.slice(this.image.indexOf(',') + 1);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  /**
   * Call the API to upload image to imgur
   */
  uploadImage(): void {
    this.userService.uploadImage(this.imageBase64).subscribe(
      response => {
        this.user.imageUrl = response.data.link;
        this.changeImage();
      },
      error => {
        if (error !== null) {
          this.openSnackBar('Image is invalid.', 'snackError');
        }
      }
    );
  }

  /**
   * Call the API to change profileImage
   */
  changeImage(): void {
    this.userService
      .changeImage(this.user.name, this.user.pass, this.user.imageUrl)
      .subscribe(
        response => {
          this.openSnackBar('Image changed.', 'snackSuccess');
          if (localStorage.getItem('myUserName') !== null) {
            localStorage.setItem('myPic', this.user.imageUrl);
          } else {
            sessionStorage.setItem('myPic', this.user.imageUrl);
          }
        },
        error => {
          if (error !== null) {
            this.openSnackBar('Image is invalid.', 'snackError');
          }
        }
      );
  }

  /**
   * Sets user to null, call service to delete user's cookies and navigate to /intro
   */
  logout(): void {
    this.user = null;
    this.loginService.logout();
    this.router.navigate(['/intro']);
  }

  openSnackBar(msg: string, type: string) {
    this.snackBar.open(msg, '', {
      duration: 1000,
      panelClass: type,
      verticalPosition: 'top'
    });
  }
}
