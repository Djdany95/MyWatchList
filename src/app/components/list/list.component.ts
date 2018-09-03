import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SharedOptions } from '../../shared/models/sharedOptions';
import { Series } from '../../shared/models/series';
import { User } from '../../shared/models/user';

import { SeriesService } from '../../shared/services/series.service';
import { LoginService } from '../../shared/services/login.service';

import { EditDialog } from './edit-dialog/edit-series.dialog';

/**
 * List Component
 * Main page, shows the user's watching list
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit, AfterViewInit {
  /**
   * Used to save the user preference for nightMode
   */
  nightMode: string;

  /**
   * Used to get the user logged
   */
  user: User;

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
  @ViewChild(MatSort)
  sort: MatSort;

  /**
   * Constructor
   * @param loginService {LoginService} Service to call login API
   * @param seriesService {SeriesService} Service to call series API
   * @param dialog {MatDialog} Component used to create dialogs with material theme
   * @param router {Router} Used to implicitly navigate to a URL
   * @param titleService {Title} Service to change the web Title
   */
  constructor(
    private loginService: LoginService,
    private seriesService: SeriesService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.translate.use(localStorage.getItem('lang'));
  }

  /**
   * We set various parameters to default, check if there are cookies for autologin and if nightMode is setted in storage before.
   * When all done, fetch API to get Series List
   */
  ngOnInit() {
    if (
      localStorage.getItem('myUserName') === null &&
      sessionStorage.getItem('myUserName') === null
    ) {
      this.logout();
    }

    this.sharedOptions = new SharedOptions('', '', '');

    this.user = this.setUser();

    this.titleService.setTitle(
      this.user.name.charAt(0).toUpperCase() +
        this.user.name.slice(1) +
        ' MyWatchList'
    );

    this.getNightMode();

    this.setSharedParams();

    this.getSeries();
  }

  /**
   * Get user logged from cookies
   */
  setUser(): User {
    if (localStorage.getItem('myUserName') !== null) {
      return new User(
        localStorage.getItem('myUserName'),
        localStorage.getItem('myUserPass'),
        localStorage.getItem('myEmail'),
        localStorage.getItem('myPic')
      );
    } else {
      return new User(
        sessionStorage.getItem('myUserName'),
        sessionStorage.getItem('myUserPass'),
        sessionStorage.getItem('myEmail'),
        sessionStorage.getItem('myPic')
      );
    }
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
      .slice(0, -6)
      .concat('sharedlist/' + this.user.name);
    this.sharedOptions.description = this.user.name + ' MyWatchList';
  }

  /**
   * Calls the API and retrieve the user SeriesList
   */
  getSeries(): void {
    this.seriesService.getSeries(this.user.name).subscribe(
      response => {
        this.dataSource.data = response.data.series;
        localStorage.setItem(
          'myOfflineList',
          JSON.stringify(response.data.series)
        );
        if (!this.dataSource.data[0]) {
          this.openSnackBar(this.translate.instant('list.notFollow'), 'snackError');
        }
        this.nSeries = this.dataSource.data.length;
        if (localStorage.getItem('myUserName') !== null) {
          localStorage.setItem('myNSeries', this.nSeries.toString());
        } else {
          sessionStorage.setItem('myNSeries', this.nSeries.toString());
        }
      },
      error => {
        this.dataSource.data = [];
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
   * Call API to edit the series when the button episode watched is clicked, getting all the info about that series
   * @param seriesId
   * @param name
   * @param active
   * @param temp
   * @param epA
   */
  episodeWatched(
    seriesId: string,
    name: string,
    active: boolean,
    temp: number,
    epA: number
  ): void {
    const series = new Series(seriesId, active, name, temp, epA);

    series.epA++;
    series.active = true;

    this.seriesService.editSeries(this.user, series).subscribe(response => {
      this.getSeries();
    });
  }

  /**
   * Call API to edit the series when a season is watched, getting all the info about that series
   * @param seriesId
   * @param name
   * @param active
   * @param temp
   * @param epA
   */
  seasonWatched(
    seriesId: string,
    name: string,
    active: boolean,
    temp: number,
    epA: number
  ): void {
    const series = new Series(seriesId, active, name, temp, epA);

    series.epA = 0;
    series.temp++;
    series.active = false;

    this.seriesService.editSeries(this.user, series).subscribe(response => {
      this.getSeries();
    });
  }

  /**
   * Call the API when delete button is clicked to delete the series
   * @param seriesId Series' ID to delete
   */
  deleteSeries(seriesId: number): void {
    this.seriesService.deleteSeries(this.user, seriesId).subscribe(response => {
      this.getSeries();
      this.openSnackBar(this.translate.instant('list.deleteSuccess'), 'snackSuccess');
    });
  }

  /**
   * Fetch the actual list to check if the new series is already there
   * @param id Series' ID to check
   */
  checkSeriesDuplicated(id: string): boolean {
    let duplicatedFlag = false;

    this.dataSource.data.forEach((element: any) => {
      if (element.id === id) {
        duplicatedFlag = true;
        console.log(element);
      }
    });

    return duplicatedFlag;
  }

  /**
   * Call the API to add the new Series
   * @param series Series Object to add
   */
  addSeries(series: Series): void {
    const seriesDuplicated = this.checkSeriesDuplicated(series.id);

    if (series.id !== undefined) {
      if (!seriesDuplicated) {
        this.seriesService.newSeries(this.user, series).subscribe(response => {
          this.getSeries();
          this.openSnackBar(this.translate.instant('list.addSuccess'), 'snackSuccess');
        });
      } else {
        this.openSnackBar(this.translate.instant('list.seriesAlready'), 'snackError');
      }
    } else {
      this.openSnackBar(this.translate.instant('list.seriesNoExists'), 'snackError');
    }
  }

  /**
   * Sets user to null, list to null, call service to delete user's cookies and navigate to /intro
   */
  logout(): void {
    this.user = null;
    this.dataSource = null;
    this.loginService.logout();
    this.router.navigate(['/intro']);
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
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /**
   * Open Component EditDialog and handle the data when is closed
   * With the user inputs, call API to edit the Series
   * @param series {Series} Series Object to edit
   */
  openEditDialog(series: Series): void {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '320px',
      data: { s: series }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const serieEdit = result.s;

        if (serieEdit.epA > 0) {
          serieEdit.active = true;
        }

        if (serieEdit.epA === 0) {
          serieEdit.active = false;
        }

        this.seriesService
          .editSeries(this.user, serieEdit)
          .subscribe(response => {
            this.getSeries();
            this.openSnackBar(this.translate.instant('list.editSuccess'), 'snackSuccess');
          });
      }
    });
  }

  openSnackBar(msg: string, type: string) {
    this.snackBar.open(msg, '', {
      duration: 1000,
      panelClass: type,
      verticalPosition: 'top'
    });
  }
}
