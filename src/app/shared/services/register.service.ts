import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MYWATCHLISTAPI_URL } from '../constants/api-urls.constants';

/**
 * Service to call MyWatchList API
 * Register Services
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
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
   * Call API to register new user
   * @param user User Objecto to register
   */
  register(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(
      this.url + 'register/',
      { username: user.name, pass: user.pass, email: user.email },
      { headers: headers }
    );
  }

  /**
   * Confirms user using uniqId
   * @param uniqId id to confirm
   */
  confirmEmail(uniqId: string): Observable<any> {
    return this._http.get(this.url + 'confirmEmail/' + uniqId);
  }
}
