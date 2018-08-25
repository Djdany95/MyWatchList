import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { LoginService } from '../../shared/services/login.service';
import { UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../../shared/models/user';

import { MyErrorStateMatcher, alertify } from '../../app.component';

import * as sha256 from 'fast-sha256';
import { Title } from '@angular/platform-browser';

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
  passControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Form controls to pass
   *
   * Required and pass pattern
   */
  passControl2: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Form controls to imageURL
   *
   * Required and URL pattern
   */
  imageControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.' +
        '[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,}'
    )
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Check actual password to change
   */
  actualPass: any;
  /**
   * New password to change
   */
  newPass: any;
  /**
   * imageURL to change
   */
  imageUrl = '';

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

  /**
   * Constructor
   * @param userService {UserService} Service to call users API
   * @param loginService {LoginService} Service to call login API
   * @param router {Router} Used to implicitly navigate to a URL
   * @param cookieService {CookieService} Service to create and use custom cookies
   * @param titleService {Title} Service to change the web Title
   */
  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private titleService: Title
  ) {}

  /**
   * We set various parameters to default, check if there are cookies of user logged and if nightMode is setted in storage before.
   * If there aren't cookies, does logout
   */
  ngOnInit() {
    if (!this.cookieService.check('myUserName')) {
      this.logout();
    }
    this.nSeries = Number.parseInt(this.cookieService.get('myNSeries'));
    this.user = this.setUser();
    this.titleService.setTitle(
      this.user.name.charAt(0).toUpperCase() +
        this.user.name.slice(1) +
        '\'s Profile'
    );
    this.getNightMode();
  }

  /**
   * Get user logged from cookies
   */
  setUser(): User {
    return new User(
      this.cookieService.get('myUserName'),
      this.cookieService.get('myUserPass'),
      this.cookieService.get('myEmail'),
      this.cookieService.get('myPic')
    );
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
  deleteAccount(): void {
    this.userService
      .deleteAccount(this.user.name, this.user.pass)
      .subscribe(response => {
        this.logout();
      });
  }

  /**
   * Call the API to change Pass
   */
  changePass(): void {
    this.userService
      .changePass(
        this.user.name,
        String(sha256.hash(this.actualPass)),
        String(sha256.hash(this.newPass))
      )
      .subscribe(
        response => {
          alertify.success(document.getElementById('passChange').innerHTML);
        },
        error => {
          if (error !== null) {
            alertify.error(document.getElementById('passErr').innerHTML);
          }
        }
      );
  }

  /**
   * Call the API to change profileImage
   */
  changeImage(): void {
    this.userService
      .changeImage(this.user.name, this.user.pass, this.imageUrl)
      .subscribe(
        response => {
          alertify.success(document.getElementById('imgChange').innerHTML);
          this.user.imageUrl = this.imageUrl;
          this.loginService.setUser(this.user);
        },
        error => {
          if (error !== null) {
            alertify.error(document.getElementById('urlErr').innerHTML);
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
}
