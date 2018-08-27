import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { RegisterService } from '../../shared/services/register.service';

import { alertify } from '../../app.component';


/**
 * ConfirmEmail Component
 * Calls API to activate the user
 */

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.less']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  /**
   * Get the confirmId in the url
   */
  confirmId: string;

  /**
   * Constructor
   * @param registerService {RegisterService} Service to call register API to confirm email
   * @param route {ActivatedRoute} To get parameters on URL
   */
  constructor(
    private registerService: RegisterService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleService.setTitle('Confirm Email');
  }

  /**
   * OnInit get the confirmId in the url and call confirmEmail function
   */
  ngOnInit() {
    this.confirmId = this.route.snapshot.paramMap.get('confirmId');
    this.confirmEmail();
    document.body.classList.add('bodyIntro');
  }

  ngOnDestroy() {
    document.body.classList.remove('bodyIntro');
  }

  /**
   * Performs a call to the API to confirm the email and activate the user
   */
  confirmEmail() {
    this.registerService.confirmEmail(this.confirmId).subscribe(
      response => {
        alertify.success(document.getElementById('confirmSuccess').innerHTML);
      },
      error => {
        if (error !== null) {
          alertify.error(document.getElementById('errServer').innerHTML);
        }
      }
    );
  }
}
