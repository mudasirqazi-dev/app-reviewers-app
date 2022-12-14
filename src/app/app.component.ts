import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { alert } from './modules/shared/services/sweetAlert.service';
import { userService } from './modules/shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Review Web App';


  constructor(
    private route: ActivatedRoute,
    private userService: userService,
    private router: Router,
    private alert: alert

  ) {
  }


  ngOnInit() {

  }



}
