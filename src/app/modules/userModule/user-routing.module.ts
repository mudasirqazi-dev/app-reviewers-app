import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loginComponent } from './login/login.component';
import { registerComponent } from './register/register.component';
import { passwordForgetComponent } from './passwordForget/passwordForget.component';
import { resetPasswordComponent } from './resetPassword/resetPassword.component';

const routes: Routes = [
  { path: 'login', component: loginComponent },
  { path: 'signup', component: registerComponent },
  { path: 'password/forget', component: passwordForgetComponent },
  { path: 'reset-password', component: resetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



  exports: [RouterModule]
})
export class userRoutingModule { }

export const routedComponents = [
  loginComponent,
  registerComponent,
  passwordForgetComponent,
  resetPasswordComponent
];
