import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from './../../shared/services/user.service';
import { UserInfoService } from './../../shared/auth/userInfoService';
import { accountService } from './../../shared/services/account.service';
import { BitcoinService } from './../../shared/services/Bit.service';
import { Data } from './../../shared/services/shareDataService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  account;
  purchaseId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private UserInfoService: UserInfoService,
    private accountService: accountService,
    private bitcoinService: BitcoinService,
    private data: Data

  ) { }

  ngOnInit() {
    this.getUserDetail();
    this.getUserAccountDetail();
    this.purchaseId = this.data.getRandomNumber();
  }


  //get user detail
  getUserDetail() {
    let id = this.UserInfoService.getAuthData();
    this.userService.getUserById(id).subscribe(res => {
      this.user = res.data;
    })
  }

  //get user account detail
  getUserAccountDetail() {
    let id = this.UserInfoService.getAuthData();
    this.accountService.getUserAccount(id).subscribe(res => {
      this.account = res.data;
    })
  }


  makePurchase() {
    let data = {
      amount: "10",
      email: "abanch@gmail.com",
      orderId: "123",
      notificationUrl: "http://localhost:3000/api/purchase/notify",
      redirectUrl: "http://localhost:4200"
    }
    this.bitcoinService.purchase(data).subscribe(res => {
      console.log('res ' + JSON.stringify(res))
    })
  }


}
