import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfoService } from './../../auth/userInfoService';
import { userService } from './../../services/user.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  login: boolean = false;
  role;
  status: boolean = true;
  isConnected = true;
  user;

  constructor(
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService
  ) {
    this.role = this.userInfoService.getUserRole();
    this.getLoginUser();
  }

  ngOnInit() {
  }



  getLoginUser() {
    let id = this.userInfoService.getAuthData();
    this.userService.getUserById(id).subscribe(res => {
      this.user = res.user
    })
  }


  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }


  logout() {
    localStorage.removeItem("_auth@1")
    this.router.navigate(['/user/login'])
  }


}
