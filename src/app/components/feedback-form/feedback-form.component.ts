import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { FeedbackService } from './../../shared/services/feedback.service';

import { MyErrorStateMatcher } from './../../app.component';

/**
 * Feedback Component
 * Component with form to send feedback
 */
@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.less']
})
export class FeedbackFormComponent {
  /**
   * Constructor
   * @param feedbackService {UserService} Service to call user API
   */
  constructor(public feedbackService: FeedbackService, public snackBar: MatSnackBar) {
  }

  /**
   * Form controls to feedback input
   *
   */
  msgControl: FormControl = new FormControl('', [Validators.required]);
  /**
   * Form control to email input
   *
   * Check if email is an email
   */
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Function that gets email and msg from the form and send it to API
   */
  sendFeedback() {
    const email = this.emailControl.value;
    const msg = this.msgControl.value;
    this.feedbackService.sendFeedback(email, msg).subscribe(
      response => {
        if (response) {
          this.openSnackBar('Your feedback was sent.', 'snackSuccess');
          this.msgControl.setValue(' ');
        }
      },
      error => {
        if (error != null) {
          this.openSnackBar('Error! Please try it later.', 'snackError');
          this.msgControl.setValue(' ');
        }
      }
    );
  }

  openSnackBar(msg: string, type: string) {
    this.snackBar.open(msg, '', {
      duration: 1000,
      panelClass: type,
      verticalPosition: 'top'
    });
  }
}
