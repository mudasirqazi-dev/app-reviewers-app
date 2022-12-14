import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInfoService } from '../../../shared/auth/userInfoService';
import { alert } from './../../../shared/services/sweetAlert.service';
import { Data } from 'src/app/modules/shared/services/shareDataService';
import Swal from 'sweetalert2';
import { userService } from './../../../userModule/services/userService';
import { videoService } from './../../services/videoService';



@Component({
  templateUrl: './allVideos.component.html',
  styleUrls: ['./allVideos.component.scss'],
})
export class allVideosComponent implements OnInit {

  globalSearch;
  page = 1;
  entries = 10;
  itemPerPage = 10
  allVideos = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private userInfoService: UserInfoService,
    private videoService: videoService,
    private alert: alert,
    private data: Data

  ) {


  }


  ngOnInit() {
    this.getAllVideosList();
  }


  //get all videos list
  getAllVideosList() {
    this.videoService.getAllVideos().subscribe(res => {
      this.allVideos = res.data;
      console.log('res ' + JSON.stringify(res.data[0]))
      // this.users = res.data.filter(data => data.type != 'superAdmin');
      // let data = res.filter(data => data.role == 'user');
      // this.customers = data.reverse();
    })
  }


}
