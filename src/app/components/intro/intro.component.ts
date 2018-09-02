import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { RegisterService } from '../../shared/services/register.service';
import { LoginService } from '../../shared/services/login.service';

import { User } from '../../shared/models/user';

import { LoginDialog } from './login-dialog/login.dialog';

import * as sha256 from 'fast-sha256';

/**
 * Intro Component
 * Intro of the web, has a little description about and functions to register and login
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.less']
})
export class IntroComponent implements OnInit, OnDestroy {
  /**
   * Used to know if user is online or offline
   */
  language: string;

  /**
   * Used to know if user is online or offline
   */
  online: boolean;

  /**
   * Used to save the user when login
   */
  user: User;

  /**
   * Flag to hide or not the cookies card advice
   */
  cookiesAdvice: boolean;

  /**
   * Flag to hide or not the cookies card advice
   */
  openFeedback: boolean;

  /**
   * Languages contained in menu
   */
  languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'gl', label: 'Galego' },
    { code: 'pt', label: 'Português' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'fr', label: 'Français' }
  ];

  /**
   * Constructor
   * @param registerService {RegisterService} Service to call register API
   * @param loginService {LoginService} Service to call login API
   * @param dialog {MatDialog} Component used to open dialogs with material theme
   * @param router {Router} Used to implicitly navigate to a URL
   */
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('MyWatchList');
  }

  /**
   * We set various parameters to default and check if there are cookies for autologin
   */
  ngOnInit() {
    this.user = new User('', '', '', '');
    if (
      localStorage.getItem('myUserName') !== null &&
      localStorage.getItem('myUserPass') !== null
    ) {
      this.user.name = localStorage.getItem('myUserName');
      this.user.pass = localStorage.getItem('myUserPass');
      this.login(this.user, true);
    }
    if (localStorage.getItem('cookiesAdvice') !== null) {
      this.cookiesAdvice = false;
    } else {
      this.cookiesAdvice = true;
    }
    this.openFeedback = false;
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    document.body.classList.add('bodyIntro');
    this.getLanguage();
    this.updateOnlineStatus();
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  }

  ngOnDestroy() {
    document.body.classList.remove('bodyIntro');
  }

  getLanguage() {
    this.language = navigator.language.slice(0, 2);
    localStorage.setItem('lang', this.language);

    this.setLanguage();
  }

  setLanguage() {
    // TODO set language every time in every page
  }

  /**
   * Toggle offline flag
   */
  updateOnlineStatus() {
    this.online = navigator.onLine;
  }

  /**
   * Toggle cookiesAdvice flag
   */
  closeCookies() {
    localStorage.setItem('cookiesAdvice', 'false');
    this.cookiesAdvice = false;
  }

  /**
   * Register the user, calls the API with the service
   *
   * @param user {User} User object with params
   */
  register(user: User): void {
    this.registerService.register(user).subscribe(
      response => {
        if (response) {
          this.openSnackBar(
            'Registered successfully. Please confirm email.',
            'snackSuccess'
          );
        }
      },
      error => {
        if (error != null) {
          this.openSnackBar('Server Error! Please try later.', 'snackError');
        }
      }
    );
  }

  /**
   * Login, calls the API with the service and if is ok fills the user Object with data,
   * set the cookie for futures logins and navigate to list URL
   * @param user {User} User object with params
   */
  login(user: User, remember: boolean) {
    this.loginService.login(user.name, user.pass).subscribe(
      response => {
        if (response) {
          this.user.name = response.data.name;
          this.user.pass = response.data.pass;
          this.user.email = response.data.email;
          this.user.imageUrl = response.data.imageUrl;
          this.loginService.setUser(this.user, remember);
          this.router.navigate(['/mylist']);
        }
      },
      error => {
        if (error != null) {
          if (error.status === 403) {
            this.openSnackBar('Error! Please confirm email.', 'snackError');
            this.user.pass = '';
          } else if (error.status === 404) {
            this.openSnackBar(
              'Error! User or password are incorrect.',
              'snackError'
            );
            this.user.pass = '';
          }
        }
      }
    );
  }

  /**
   * Open Component LoginDialog and handle the data when is closed
   *
   * With the user inputs, encrypt the password and calls the function to login
   */
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '290px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.name = result.userN;
        this.user.pass = String(sha256.hash(result.pass));
        this.login(this.user, result.remember);
      }
    });
  }

  offlineList() {
    if (localStorage.getItem('myOfflineList') !== null) {
      this.router.navigate(['/offlinelist']);
    }
  }

  openSnackBar(msg: string, type: string) {
    this.snackBar.open(msg, '', {
      duration: 1000,
      panelClass: type,
      verticalPosition: 'top'
    });
  }
}
