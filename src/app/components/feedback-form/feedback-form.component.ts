import { FeedbackService } from './../../shared/services/feedback.service';
import { MyErrorStateMatcher, alertify } from './../../app.component';
import { FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

/**
 * Feedback Component
 * Component with form to send feedback
 */
@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent {
  /**
   * Constructor
   * @param feedbackService {UserService} Service to call user API
   */
  constructor(public feedbackService: FeedbackService) {
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
          alertify.success(document.getElementById('okFeedback').innerHTML);
          this.msgControl.setValue(' ');
        }
      },
      error => {
        if (error != null) {
          alertify.error(document.getElementById('errFeedback').innerHTML);
          this.msgControl.setValue(' ');
        }
      }
    );
  }
}
