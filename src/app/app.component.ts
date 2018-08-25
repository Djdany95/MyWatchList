import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Class to match errors
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  /**
   * Error when invalid control is dirty, touched, or submitted.
   * @param control {FormControl}
   * @param form {FormGroup}
   */
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

/**
 * Needed to use require keyword
 */
declare var require: any;
/**
 * Export alertify to use in app as alerts
 */
export const alertify = require('alertifyjs');

/**
 * Main Component
 * Just show the page
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  /**
   * Constructor
   */
  public constructor() {}
}
