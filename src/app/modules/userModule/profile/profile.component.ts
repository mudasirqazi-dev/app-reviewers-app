import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from './../../shared/services/user.service';
import { UserInfoService } from './../../shared/auth/userInfoService';
import { accountService } from './../../shared/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user;
  account;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private UserInfoService: UserInfoService,
    private accountService: accountService
  ) {}

  ngOnInit() {
    this.getUserDetail();
    this.getUserAccountDetail();
  }

  //get user detail
  getUserDetail() {
    let id = this.UserInfoService.getAuthData();
    this.userService.getUserById(id).subscribe((res) => {
      this.user = res.data;
    });
  }

  //get user account detail
  getUserAccountDetail() {
    let id = this.UserInfoService.getAuthData();
    this.accountService.getUserAccount(id).subscribe((res) => {
      console.log('res ' + JSON.stringify(res));
      this.account = res.data;
    });
  }
}
