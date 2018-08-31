import { Injectable } from '@angular/core';
import { User } from '../models/user';
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
   */
  constructor(private _http: HttpClient) {
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
  setUser(user: User, remember: boolean): void {
    if (remember) {
      localStorage.setItem('myUserName', user.name);
      localStorage.setItem('myUserPass', user.pass);
      localStorage.setItem('myEmail', user.email);
      localStorage.setItem('myPic', user.imageUrl);
    } else {
      sessionStorage.setItem('myUserName', user.name);
      sessionStorage.setItem('myUserPass', user.pass);
      sessionStorage.setItem('myEmail', user.email);
      sessionStorage.setItem('myPic', user.imageUrl);
    }
  }

  /**
   * Delete User cookies when logout
   */
  logout(): void {
    localStorage.removeItem('myUserName');
    localStorage.removeItem('myUserPass');
    localStorage.removeItem('myEmail');
    localStorage.removeItem('myPic');
    localStorage.removeItem('myNSeries');
    sessionStorage.removeItem('myUserName');
    sessionStorage.removeItem('myUserPass');
    sessionStorage.removeItem('myEmail');
    sessionStorage.removeItem('myPic');
    sessionStorage.removeItem('myNSeries');
  }
}
