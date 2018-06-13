import { Injectable } from '@angular/core';
import { Series } from '../models/series';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { MYWATCHLISTAPI_URL } from '../constants/api-urls.constants';

/**
 * Service to call MyWatchList API
 * Series Services
 */
@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  /**
   * API's URL
   */
  public url: string;

  /**
   * Constructor
   * @param _http {HttpClient} Service to call the API
   */
  constructor(private _http: HttpClient) {
    this.url = MYWATCHLISTAPI_URL + '/seriesList/';
  }

  /**
   * Used to get User's SeriesList
   * @param username Username
   */
  getSeries(username: string): Observable<any> {
    return this._http.get(this.url + 'series/' + username);
  }

  /**
   * Used to count the series that user is following
   * @param username Username
   */
  countSeries(username: string): Observable<any> {
    return this._http.get(this.url + 'countSeries/' + username);
  }

  /**
   * Used to add new series to user's SeriesList
   * @param user User Object
   * @param series Series Object
   */
  newSeries(user: User, series: Series): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(
      this.url + 'series/',
      {
        username: user.name,
        pass: user.pass,
        id: series.id,
        name: series.name,
        active: series.active,
        temp: series.temp,
        epA: series.epA
      },
      { headers: headers }
    );
  }

  /**
   * Used to edit the series in user's SeriesList
   * @param user User Object
   * @param series Series Object
   */
  editSeries(user: User, series: Series): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.put(
      this.url + 'series/' + series.id,
      {
        username: user.name,
        pass: user.pass,
        name: series.name,
        active: series.active,
        temp: series.temp,
        epA: series.epA
      },
      { headers: headers }
    );
  }

  /**
   * Used to delete the series in user's SeriesList
   * @param user User Object
   * @param seriesId SeriesId to delete
   */
  deleteSeries(user: User, seriesId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { username: user.name, pass: user.pass }
    };
    return this._http.delete(this.url + 'series/' + seriesId, httpOptions);
  }
}
