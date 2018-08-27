import { Component, OnDestroy } from '@angular/core';

/**
 * Error Component
 * Used to show 404 custom web
 */
@Component({
  selector: 'app-error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.less']
})
export class Error404Component implements OnDestroy {
  /**
   * Constructor
   */
  constructor() {
    document.body.classList.add('body404');
  }

  ngOnDestroy() {
    document.body.classList.remove('body404');
  }
}
