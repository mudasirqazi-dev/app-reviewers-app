import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { userService } from './../../shared/services/user.service';
import { UserInfoService } from './../../shared/auth/userInfoService';

import { alert } from './../../shared/services/sweetAlert.service';
import { password } from './../models/password';

@Component({
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss'],
})
export class resetPasswordComponent implements OnInit {
  password = new password();
  token: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService,
    private alert: alert
  ) { }


  isLoggedin
  ngOnInit() {
    this.getToken();
  }


  getToken() {
    this.route.queryParams.subscribe(res => {
      let token = res.token;
      if (token) {
        this.token = token;
      } else {
        this.router.navigateByUrl('/user/login')
      }
    })
  }

  resetPassword() {
    this.password.newPassword = this.password.newPassword.trim();
    this.password.confirmPassword = this.password.confirmPassword.trim();
    // this.password.id = this.userInfoService.getAuthData();
    if (this.password.newPassword != this.password.confirmPassword) {
      this.alert.responseAlert('Password not match', "error");
      return;
    }
    let data = {
      password: this.password.newPassword,
      token: this.token
    }
    this.userService.resetForgotPassword(data).subscribe(res => {
      if (res.success) {
        this.alert.responseAlert('Password update successfully', 'success')
        this.router.navigateByUrl('/user/login');
      }
    })
  }

}

