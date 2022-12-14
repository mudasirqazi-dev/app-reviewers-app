import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { homeComponent } from './home/home.component';
import { sendMessageComponent } from './appReviews/sendMessage.component';
import { ProfileComponent } from './../userModule/profile/profile.component';

const routes: Routes = [
  { path: '', component: homeComponent },
  { path: 'sms/:contact', component: sendMessageComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],





  exports: [RouterModule]
})
export class pagesRoutingModule { }

export const routedComponents = [
  homeComponent,
  sendMessageComponent,
  ProfileComponent

];
