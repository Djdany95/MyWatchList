import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MYWATCHLISTAPI_URL } from '../constants/api-urls.constants';

/**
 * Service to call MyWatchList API
 * Login Services
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /**
   * API's URL
   */
  public url: string;

  /**
   * Constructor
   * @param _http {HttpClient} Service to call the API
   * @param cookieService {CookieService} Service to set and delete cookies
   */
  constructor(private _http: HttpClient, private cookieService: CookieService) {
    this.url = MYWATCHLISTAPI_URL + '/user/';
  }

  /**
   * Call API to login user passed
   * @param username Username
   * @param pass Password
   */
  login(username: string, pass: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(
      this.url + 'login/',
      { username: username, pass: pass },
      { headers: headers }
    );
  }

  /**
   * Call API to remember user and generate new random pass
   * @param email User Email
   */
  rememberAuth(email: string): Observable<any> {
    return this._http.get(this.url + 'remember/' + email);
  }

  /**
   * Set User cookies
   * @param user User Object to save in cookies
   */
  setUser(user: User): void {
    this.cookieService.set('myUserName', user.name);
    this.cookieService.set('myUserPass', user.pass);
    this.cookieService.set('myEmail', user.email);
    this.cookieService.set('myPic', user.imageUrl);
  }

  /**
   * Delete User cookies when logout
   */
  logout(): void {
    this.cookieService.delete('myUserName');
    this.cookieService.delete('myUserPass');
    this.cookieService.delete('myEmail');
    this.cookieService.delete('myPic');
    this.cookieService.delete('myNSeries');
  }
}
