import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { SeriesService } from '../../shared/services/series.service';
import { UserService } from '../../shared/services/user.service';

import { alertify } from '../../app.component';
import { SharedOptions } from '../../shared/models/sharedOptions';

/**
 * ListShare Component
 * Shows the public shared user's watching list
 */
@Component({
  selector: 'app-list-share',
  templateUrl: './list-share.component.html',
  styleUrls: ['./list-share.component.css']
})
export class ListShareComponent implements OnInit, AfterViewInit {
  /**
   * Used to get the user preference for nightMode
   */
  nightMode: string;

  /**
   * Used to get the list's username
   */
  userName = this.route.snapshot.paramMap.get('name');
  /**
   * Used to get the user profile image
   */
  image: string;

  /**
   * List's Columns
   */
  displayedColumns = ['active', 'name', 'temp', 'epA', 'buttons'];
  /**
   * Component MatTable
   */
  dataSource = new MatTableDataSource();

  /**
   * Number of series the user is following
   */
  nSeries: number;

  /**
   * Used to save the SharedOptions of ShareButtons
   */
  sharedOptions: SharedOptions;

  /**
   * Used to watch if the list is sortered
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Constructor
   * @param seriesService {SeriesService} Service to call series API
   * @param userService {UserService} Service to call users API
   * @param route {ActivatedRoute} Service used to get url params
   * @param router {Router} Used to implicitly navigate to a URL
   * @param titleService {Title} Service to change the web Title
   */
  constructor(
    private seriesService: SeriesService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  /**
   * We set various parameters to default, check if there are username and if nightMode is setted in storage before.
   * When all done, fetch API to get User Series List
   */
  ngOnInit() {
    this.titleService.setTitle(
      this.userName.charAt(0).toUpperCase() +
      this.userName.slice(1) +
      '\'s Public Series List'
    );

    this.sharedOptions = new SharedOptions('', '', '');

    this.getNightMode();

    this.findUser(this.userName);
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
      this.sharedOptions.theme = 'material-dark';
      document.body.style.backgroundColor = '#142635';
      document.body.style.color = '#bdc7c1';
    } else {
      this.nightMode = 'false';
      this.sharedOptions.theme = 'material-light';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }

  /**
   * Set various preferences for the SharedListComponent
   */
  setSharedParams(): void {
    this.sharedOptions.theme =
      localStorage.getItem('nightMode') === 'true'
        ? 'material-dark'
        : 'material-light';
    this.sharedOptions.url = window.location.href
      .slice(0, -7)
      .concat('sharedList/' + this.userName);
    this.sharedOptions.description = this.userName + ' Public Series List';
  }

  /**
   * Calls the API to search the username if exists and retrieve the user SeriesList
   */
  findUser(username: string): void {
    this.userService.getSharedUser(username).subscribe(
      response => {
        if (response) {
          this.userName = response.data[0].name;
          this.image = response.data[0].imageUrl;
          this.getSeries();
        }
      },
      error => {
        if (error != null) {
          alertify.error(document.getElementById('errUser').innerHTML);
          this.router.navigateByUrl('/intro');
        }
      }
    );
  }

  /**
   * Calls the API and retrieve the user SeriesList
   */
  getSeries(): void {
    this.seriesService.getSeries(this.userName).subscribe(
      response => {
        this.dataSource.data = response.data.series;
        if (!this.dataSource.data[0]) {
          alertify.error(
            this.userName + document.getElementById('notFollow').innerHTML
          );
        }
        this.countSeries();
      },
      error => {
        this.dataSource.data = [];
      }
    );
  }

  /**
   * Call the API to count the series' user follows
   */
  countSeries(): void {
    this.seriesService.countSeries(this.userName).subscribe(
      response => {
        this.nSeries = response.data[0].nSeries;
      },
      error => {
        this.nSeries = 0;
      }
    );
  }

  /**
   * Toggle nightMode when the user clicks the button
   */
  toggleNightMode(): void {
    if (localStorage.getItem('nightMode') === 'true') {
      localStorage.setItem('nightMode', 'false');
    } else {
      localStorage.setItem('nightMode', 'true');
    }
    this.setBodyNightMode();
  }

  /**
   * If user sorts the list, update the view
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * If user filters the list, update the view
   * @param filterValue User's filter
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
