import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { userService } from './../../shared/services/user.service';
import { alert } from './../../shared/services/sweetAlert.service';

@Component({
  templateUrl: './passwordForget.component.html',
  styleUrls: ['./passwordForget.component.scss'],
})
export class passwordForgetComponent implements OnInit {

  email;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private alert: alert
  ) { }


  isLoggedin
  ngOnInit() {

  }


  sendForgetEmail() {
    let data = {
      email: this.email
    }
    this.userService.forgetPassword(data).subscribe(res => {
      if (res.success) {
        this.alert.responseAlert('Password reset email sent to your email please check and update your passowrd', 'success')
        this.router.navigateByUrl('/user/login')
      }
    })
  }

}

