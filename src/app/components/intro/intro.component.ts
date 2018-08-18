import { MatDialog } from '@angular/material';
import { LoginDialog } from './login-dialog/login.dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { RegisterService } from '../../shared/services/register.service';
import { UserService } from '../../shared/services/user.service';
import { LoginService } from '../../shared/services/login.service';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../../shared/models/user';

import { MyErrorStateMatcher, alertify } from '../../app.component';

import * as sha256 from 'fast-sha256';

/**
 * Intro Component
 * Intro of the web, has a little description about and functions to register and login
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
  /**
   * Used to save the user when login
   */
  user: User;

  /**
   * Flag to hide or not the cookies card info
   */
  cookiesAdvice: boolean;

  /**
   * Constructor
   * @param registerService {RegisterService} Service to call register API
   * @param loginService {LoginService} Service to call login API
   * @param userService {UserService} Service to call user API
   * @param dialog {MatDialog} Component used to open dialogs with material theme
   * @param router {Router} Used to implicitly navigate to a URL
   * @param cookieService {CookieService} Service to create and use custom cookies
   */
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private cookieService: CookieService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Welcome to MyWatchList');
  }

  /**
   * We set various parameters to default and check if there are cookies for autologin
   */
  ngOnInit() {
    this.user = new User('', '', '', '');
    if (
      this.cookieService.check('myUserName') &&
      this.cookieService.check('myUserPass')
    ) {
      this.user.name = this.cookieService.get('myUserName');
      this.user.pass = this.cookieService.get('myUserPass');
      this.login(this.user);
    }
    if (this.cookieService.check('cookiesAdvice')) {
      this.cookiesAdvice = false;
    } else {
      this.cookiesAdvice = true;
    }
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  }

  /**
   * Toggle cookiesAdvice flag
   */
  closeCookies() {
    this.cookieService.set('cookiesAdvice', 'false');
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
          alertify.success(
            document.getElementById('registerSuccess').innerHTML
          );
        }
      },
      error => {
        if (error != null) {
          alertify.error(document.getElementById('errServer').innerHTML);
        }
      }
    );
  }

  /**
   * Login, calls the API with the service and if is ok fills the user Object with data,
   * set the cookie for futures logins and navigate to list URL
   * @param user {User} User object with params
   */
  login(user: User) {
    this.loginService.login(user.name, user.pass).subscribe(
      response => {
        if (response) {
          this.user.name = response.data.name;
          this.user.pass = response.data.pass;
          this.user.email = response.data.email;
          this.user.imageUrl = response.data.imageUrl;
          this.loginService.setUser(this.user);
          this.router.navigate(['/mylist']);
        }
      },
      error => {
        if (error != null) {
          if (error.status === 403) {
            alertify.error(document.getElementById('errConfirm').innerHTML);
            this.user.pass = '';
          } else if (error.status === 404) {
            alertify.error(document.getElementById('errUser').innerHTML);
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
        this.login(this.user);
      }
    });
  }
}
