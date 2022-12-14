import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { register } from './../models/register';
import { MatSliderChange } from '@angular/material/slider';
import { alert } from './../../shared/services/sweetAlert.service';
import { userService } from './../../shared/services/user.service';
;

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class registerComponent implements OnInit {


  user = new register();
  show: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private alert: alert,
  ) { }


  ngOnInit() {

  }

  togglePassword() {
    this.show = !this.show;
  }

  registerUser() {
    this.userService.registerNewUser(this.user).subscribe(res => {
      if (res.success) {
        this.alert.responseAlert(res.message, "success");
        this.router.navigateByUrl('/user/login')
      }
    })
  }
}


