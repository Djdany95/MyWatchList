import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatMenuModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher
} from '@angular/material';
import 'hammerJS';

import { ListComponent } from './components/list/list.component';
import { IntroComponent } from './components/intro/intro.component';
import { AppRoutingModule } from './shared/routes/app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { InfoCookiesComponent } from './components/info-cookies/info-cookies.component';
import { ListShareComponent } from './components/list-share/list-share.component';
import { RouterModule } from '@angular/router';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsOptions } from '@ngx-share/core';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SeriesDetailsComponent } from './components/series-details/series-details.component';
import { NewSeriesComponent } from './components/new-series/new-series.component';
import { Error404Component } from './shared/error-404/error-404.component';
import { environment } from '../environments/environment';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { LoginDialog } from './components/intro/login-dialog/login.dialog';
import { RememberDialog } from './components/intro/remember-dialog/remember.dialog';
import { EditDialog } from './components/list/edit-dialog/edit-series.dialog';
import { TWITTER_ACCOUNT } from './shared/constants/api-keys.constants';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';

/**
 * Options to SharedButtons Module
 */
const shareOptions: ShareButtonsOptions = {
  gaTracking: true,
  twitterAccount: TWITTER_ACCOUNT
};

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    LoginDialog,
    RememberDialog,
    IntroComponent,
    EditDialog,
    InfoCookiesComponent,
    ListShareComponent,
    ProfileComponent,
    ConfirmEmailComponent,
    SeriesDetailsComponent,
    NewSeriesComponent,
    Error404Component,
    RegisterFormComponent,
    FeedbackFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule, // for share counts
    HttpClientJsonpModule, // for linkedin and tumblr share counts
    ShareButtonsModule.forRoot({ options: shareOptions }),
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production
    }),
    NgProgressModule.forRoot({
      thick: true,
      color: '#673ab7',
      spinnerPosition: 'left'
    }),
    NgProgressHttpModule,
    NgProgressRouterModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    CookieService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ListComponent,
    EditDialog,
    IntroComponent,
    LoginDialog,
    RememberDialog,
    ListShareComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
