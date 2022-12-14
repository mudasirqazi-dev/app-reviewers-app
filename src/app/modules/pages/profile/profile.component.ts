import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { userService } from './../../shared/services/user.service';
import { UserInfoService } from './../../shared/auth/userInfoService';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class homeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private UserInfoService: UserInfoService

  ) { }

  ngOnInit() {
    this.getUserDetail();
  }


  //get user detail
  getUserDetail() {
    let id = this.UserInfoService.getAuthData();
    console.log('id ' + id)
    this.userService.getUserById(id).subscribe(res => {
      console.log('res' + JSON.stringify(res))
    })
  }

}
