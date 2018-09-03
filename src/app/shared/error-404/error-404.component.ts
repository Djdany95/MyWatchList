import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(private translate: TranslateService) {
    document.body.classList.add('body404');
    this.translate.use(localStorage.getItem('lang'));
  }

  ngOnDestroy() {
    document.body.classList.remove('body404');
  }
}
