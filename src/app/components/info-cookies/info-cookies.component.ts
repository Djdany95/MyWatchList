import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * InfoCookies Component
 * Just to inform about the cookies, only renders the template
 */
@Component({
  selector: 'app-info-cookies',
  templateUrl: './info-cookies.component.html',
  styleUrls: ['./info-cookies.component.less']
})
export class InfoCookiesComponent {

  /**
   * Constructor
   * @param titleService {Title} Service to change web Title
   */
  constructor(private titleService: Title) {
    this.titleService.setTitle('About Cookies');
  }
}
