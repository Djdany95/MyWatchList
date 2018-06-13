import { MYWATCHLISTAPI_URL } from './../constants/api-urls.constants';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Service to call MyWatchList API
 * Feedback Services
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  /**
   * API's URL
   */
  public url: string;

  /**
   * Constructor
   * @param _http {HttpClient} Service to call the API
   */
  constructor(private _http: HttpClient) {
    this.url = MYWATCHLISTAPI_URL + '/feedback/';
  }

  /**
   * Used to add new series to user's SeriesList
   * @param email User Email
   * @param msg User Message
   */
  sendFeedback(email: string, msg: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(
      this.url + 'sendfeedback/',
      {
        email: email,
        msg: msg
      },
      { headers: headers }
    );
  }
}
