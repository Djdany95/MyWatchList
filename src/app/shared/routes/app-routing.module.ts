import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IntroComponent } from '../../components/intro/intro.component';
import { ListComponent } from '../../components/list/list.component';
import { ListShareComponent } from '../../components/list-share/list-share.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { ConfirmEmailComponent } from '../../components/confirm-email/confirm-email.component';
import { SeriesDetailsComponent } from '../../components/series-details/series-details.component';
import { Error404Component } from '../error-404/error-404.component';

/**
 * Web Routes
 */
const APP_ROUTES: Routes = [
  { path: '', component: IntroComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'mylist', component: ListComponent },
  { path: 'sharedlist/:name', component: ListShareComponent },
  { path: 'offlinelist', component: ListShareComponent },
  { path: 'profile/:name', component: ProfileComponent },
  { path: 'confirmemail/:confirmId', component: ConfirmEmailComponent },
  { path: 'details/:id', component: SeriesDetailsComponent },
  { path: 'series-not-found', component: Error404Component }
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
