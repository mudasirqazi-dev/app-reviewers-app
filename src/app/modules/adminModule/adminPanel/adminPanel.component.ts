import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Data } from 'src/app/modules/shared/services/shareDataService';
// import { userService } from './../../userModule/services/userService';
import * as moment from 'moment';

@Component({
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.scss'],
})
export class adminPanelComponent implements OnInit {
  public activeOptionButton = "all";
  selected: any = {
    startDate: new Date(),
    endDate: new Date()
  };
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  options: any = {

    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'rtl', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    firstDay: 1 // first day is monday
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }

  //stats
  totalCappers = 0;
  totalSubscribers = 0;
  activeVideos = 0;
  pendingApprovel = 0;

  message;
  messageClass;
  isChart: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private userService: userService,
    private data: Data
  ) { }


  currentYear;
  currentMonth;
  ngOnInit() {
    // this.getAllUsers();
  }


  datesUpdated(ev) {

  }

  //get all users
  // getAllUsers() {
  //   this.userService.getAllUsers().subscribe(res => {
  //     this.totalCappers = res.data.filter(data => data.type == 'capper').length;
  //     this.totalSubscribers = res.data.filter(data => data.type == 'user').length;
  //     // console.log('data ' + users.length)
  //   })
  // }





}
