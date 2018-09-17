import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { OmdbapiService } from '../../shared/services/omdbapi.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * SeriesDetails Component
 * Page to show info about series
 */
@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.less']
})
export class SeriesDetailsComponent implements OnInit {
  /**
   * Used to save the user preference for nightMode
   */
  nightMode: string;

  /**
   * Used to get the series' details
   */
  imdbID = this.route.snapshot.paramMap.get('id');

  /**
   * JSON with series' details
   */
  series = {
    Actors: '',
    Director: '',
    Writer: '',
    Title: '',
    imdbRating: '',
    Poster: '',
    Plot: '',
    Genre: '',
    Country: '',
    Released: '',
    totalSeasons: '',
    Runtime: ''
  };

  /**
   * Used to separate the actors
   */
  actors = new Array<string>();

  /**
   * Used to separate the directors
   */
  directors = new Array<string>();

  /**
   * Used to separate the writers
   */
  writers = new Array<string>();

  /**
   * Constructor
   * @param route {ActivatedRoute} Service used to get url params
   * @param omdbAPI {OmdbapiService} Service to call OMDB API
   * @param titleService {Title} Service to change the web Title
   */
  constructor(
    private route: ActivatedRoute,
    private omdbAPI: OmdbapiService,
    private titleService: Title,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use(localStorage.getItem('lang'));
  }

  /**
   * We set nightMode if exists and get SeriesDetails from API with the given ID
   */
  ngOnInit() {
    this.getNightMode();

    this.getSeriesDetails();
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
   * Call API to get details about the given ID Series
   */
  getSeriesDetails() {
    this.omdbAPI.getSeriesDetailsOMDB(this.imdbID).subscribe(
      response => {
        this.series = response;
        this.actors = this.series.Actors.split(', ');
        this.directors = this.series.Director.split(', ');
        this.writers = this.series.Writer.split(', ');
        this.titleService.setTitle(this.series.Title);
      },
      error => {
        this.router.navigate(['/series-not-found']);
        console.log(error);
      }
    );
  }
}
