import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OMDB_APIKEY } from '../constants/api-keys.constants';
import { OMDB_URL } from '../constants/api-urls.constants';

/**
 * Service to call OMDB API
 * SeriesTitles and Details
 */
@Injectable({
  providedIn: 'root'
})
export class OmdbapiService {
  /**
   * API's URL
   */
  public url: string;
  /**
   * API's KEY
   */
  public apikey: string;

  /**
   * Constructor
   * @param _http {HttpClient} Service to call the API
   */
  constructor(private _http: HttpClient) {
    this.apikey = OMDB_APIKEY;
    this.url = OMDB_URL + this.apikey;
  }

  /**
   * Get Predicted seriesTitles from API
   * @param series Series name to fetch
   */
  getSeriesTitleOMDB(series: string): Observable<any> {
    return this._http.get(this.url + '&type=series&s=' + series);
  }

  /**
   * Get Details from API
   * @param series Series ID to fetch
   */
  getSeriesDetailsOMDB(series: string): Observable<any> {
    return this._http.get(this.url + '&type=series&i=' + series + '&plot=full');
  }
}
