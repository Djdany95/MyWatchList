import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IntroComponent } from '../../components/intro/intro.component';
import { ListComponent } from '../../components/list/list.component';
import { InfoCookiesComponent } from '../../components/info-cookies/info-cookies.component';
import { ListShareComponent } from '../../components/list-share/list-share.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { ConfirmEmailComponent } from '../../components/confirm-email/confirm-email.component';
import { SeriesDetailsComponent } from '../../components/series-details/series-details.component';
import { Error404Component } from '../error-404/error-404.component';

/**
 * Web Routes
 */
const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent },
  { path: 'my-list', component: ListComponent },
  { path: 'info-cookies', component: InfoCookiesComponent },
  { path: 'sharedList/:name', component: ListShareComponent },
  { path: 'profile/:name', component: ProfileComponent },
  { path: 'confirmEmail/:confirmId', component: ConfirmEmailComponent },
  { path: 'details/:id', component: SeriesDetailsComponent },
  { path: '**', component: IntroComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
