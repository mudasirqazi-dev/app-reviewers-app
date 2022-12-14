import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Data } from '../../shared/services/shareDataService';
import { userModel } from '../models/user';
import { UserInfoService } from '../../shared/auth/userInfoService';
import { alert } from './../../shared/services/sweetAlert.service';
import { userService } from './../../shared/services/user.service';
declare var $: any;


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class loginComponent implements OnInit {
  user = new userModel();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: Data,
    private alert: alert,
    private userService: userService,
    private userInfoService: UserInfoService
  ) {
  }
  ngOnInit() {
    this.verifyEmail();
  }
  //check login
  checkLogin() {
    let role = this.userInfoService.getUserRole();
    if (role === 'superAdmin') {
      this.router.navigate(['/dashboard']);
    }

  }

  verifyEmail() {
    this.route.queryParams.subscribe(res => {
      let token = res.token;
      if (token) {
        let data = {
          token: token
        }
        this.userService.verifyUserEmail(data).subscribe(res => {
          if (res.success) {
            this.alert.responseAlert(res.message, "success");
            this.router.navigateByUrl('/user/login')
          }
        })
      }
    })
  }

  onLogin() {
    this.userService.loginUser(this.user).subscribe(res => {
      localStorage.setItem("_auth@", res.data);
      let role = this.userInfoService.getUserRole();
      console.log('role  ' + role)
      if (role === 'user') {
        this.router.navigate(['/home']);
      }


    })



  }

  emailChange() {
    this.user.email = this.user.email.trim().toLowerCase();

  }

}