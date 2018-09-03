import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MYWATCHLISTAPI_URL } from '../constants/api-urls.constants';

/**
 * Service to call MyWatchList API
 * User Services
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
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
   * Used to check if user exists in the DB
   * @param username Username
   * @param email Email
   */
  getUser(username: string, email: string): Observable<any> {
    return this._http.get(this.url + 'user/' + username + '/' + email);
  }

  /**
   * Used to check if user exists, get username and image in the DB
   * @param username Username
   */
  getSharedUser(username: string): Observable<any> {
    return this._http.get(this.url + 'shareduser/' + username);
  }

  /**
   * User to change User Password
   * @param username Username
   * @param pass Actual Password
   * @param nPass New Password
   */
  changePass(username: string, pass: string, nPass: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.put(
      this.url + 'changePass/',
      { username: username, pass: pass, newPass: nPass },
      { headers: headers }
    );
  }

  /**
   * Used to upload image to imgur
   * @param imageBase64 Base64 encoded image
   */
  uploadImage(
    imageBase64: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': 'Client-ID 144475adecb0f35' });
    return this._http.post(
      'https://api.imgur.com/3/image',
      { image: imageBase64 },
      { headers: headers }
    );
  }

  /**
   * Used to change User Profile Image
   * @param username Username
   * @param pass Password
   * @param imageUrl New Image URL
   */
  changeImage(
    username: string,
    pass: string,
    imageUrl: string
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.put(
      this.url + 'changeImage/',
      { username: username, pass: pass, imageUrl: imageUrl },
      { headers: headers }
    );
  }

  /**
   * Used to delete User Account from DB
   * @param username Username
   * @param pass Password
   */
  deleteAccount(username: string, pass: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { username: username, pass: pass }
    };
    return this._http.delete(this.url + 'user/', httpOptions);
  }
}
