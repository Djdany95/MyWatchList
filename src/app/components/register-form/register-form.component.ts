import { FormControl, Validators } from '@angular/forms';
import { User } from './../../shared/models/user';
import { alertify, MyErrorStateMatcher } from './../../app.component';
import { UserService } from './../../shared/services/user.service';
import { Component, Output, EventEmitter } from '@angular/core';
import * as sha256 from 'fast-sha256';

/**
 * Register Component
 * Component with form to Register user
 */
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.less']
})
export class RegisterFormComponent {
  /**
   * Emitter to pass user to intro component
   */
  @Output() user: EventEmitter<User> = new EventEmitter();

  /**
   * User to emit when register
   */
  nUser: User;

  /**
   * Constructor
   * @param userService {UserService} Service to call user API
   */
  constructor(private userService: UserService) {
    this.nUser = new User('', '', '', '');
  }

  /**
   * Form controls to name input
   *
   * NamePattern is always begin with letter and can be letters and number with lenght between 6, 16
   */
  nameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9]{6,16}$')
  ]);
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
   * Form control to password input
   *
   * PassPattern is alphanumeric with lenght between 8, 64. In register, pass is encrypted with SHA-265
   */
  passControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Form control to password 2 input
   *
   * PassPattern is alphanumeric with lenght between 8, 64. In register, pass is encrypted with SHA-265
   */
  pass2Control: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,64}$')
  ]);
  /**
   * Used to check if formcontrols have errors
   */
  matcher = new MyErrorStateMatcher();

  /**
   * Check if username and email already exists
   *
   * @param username {string} User name
   * @param email {string} User email
   */
  checkUsernameEmail(username: string, email: string) {
    this.userService.getUser(username, email).subscribe(
      response => {
        if (response.data === 'username') {
          alertify.error(document.getElementById('userExist').innerHTML);
        } else if (response.data === 'email') {
          alertify.error(document.getElementById('emailExist').innerHTML);
        }
      },
      error => {
        this.user.emit(this.nUser);
      }
    );
  }

  /**
   * Function when user clicks in register
   */
  register() {
    if (
      this.passControl.value === this.pass2Control.value &&
      !this.nameControl.hasError('required') &&
      !this.passControl.hasError('required') &&
      !this.nameControl.hasError('pattern') &&
      !this.passControl.hasError('pattern') &&
      !this.emailControl.hasError('required') &&
      !this.emailControl.hasError('email')
    ) {
      this.nUser.name = this.nameControl.value;
      this.nUser.pass = String(sha256.hash(this.passControl.value));
      this.nUser.email = this.emailControl.value;

      this.checkUsernameEmail(this.nUser.name, this.nUser.email);
    }
  }
}
