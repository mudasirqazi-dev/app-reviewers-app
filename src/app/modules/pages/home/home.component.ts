import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { appService } from './../../shared/services/app.service';
import { accountService } from './../../shared/services/account.service';
import { UserInfoService } from './../../shared/auth/userInfoService';
import { alert } from './../../shared/services/sweetAlert.service';
declare var $: any;
export interface PeriodicElement {
  username: string;
}

const ELEMENT_DATA: PeriodicElement[] = [{ username: 'aban' }];

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class homeComponent implements OnInit {
  searchText: string;
  entries: number = 30;
  page: number = 1;

  cost: number = 0.1;
  displayedColumns = ['username'];
  dataSource = ELEMENT_DATA;
  isData: boolean = false;
  allUsers = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: appService,
    private userInfoService: UserInfoService,
    private accountService: accountService,
    private alert: alert
  ) {}

  ngOnInit() {
    this.accountService.getCost().subscribe((res) => {
      if (res.success) {
        const t: any = res.data;
        this.cost = t?.cost ? parseFloat(t.cost) : 0.1;
      }
    });
  }

  searchAppReviews() {
    let userId = this.userInfoService.getAuthData();
    this.appService
      .searchAppReviews(userId, this.searchText)
      .subscribe((res) => {
        this.dataSource = res;
        this.allUsers = res;
        if (res.length > 0) {
          this.isData = true;
        }

        for (let i = 0; i < this.allUsers.length; i++) {
          this.allUsers[i].contact = this.getReviewContact(this.allUsers[i]);
        }
      });
  }

  myReduce(o, fields, p, c) {
    // p: path
    // c: context (accumulator)
    if (p === undefined) (p = ''), (c = {});
    for (var prop in o) {
      if (!o.hasOwnProperty(prop)) continue;
      if (fields.indexOf(prop) != -1) c[p + prop] = o[prop];
      else if (typeof o[prop] === 'object')
        this.myReduce(o[prop], fields, prop + '/', c);
    }
    return c;
  }

  isDetail: boolean = false;
  showDetails() {
    let id = this.userInfoService.getAuthData();
    this.appService.viewUserDetails(id).subscribe((res) => {
      if (res.success) {
        this.isDetail = true;
      } else {
        this.alert.responseAlert(res.message, 'error');
      }
    });

    // let data = this.allUsers[0];
    // var keys = Object.keys(data);
    // const key = 'phone_0'

    // const result = this.startsWith(keys, key);
    // console.log('res ' + JSON.stringify(result));
    // let index = keys.findIndex(data => data == result);
    // console.log('index' + index);
    // let keyVal = Object.values(data)[index];
    // if (keyVal) {
    //   let value = keyVal.toString()
    //   const parts = value.split(';');
    //   console.log('parts ' + parts);
    //   console.log(parts[0]);
    // }

    // console.log('key val ' + keyVal)

    console.log('showd details');
  }

  userSelect = [];
  deliveryIds = [];
  selectedAll: boolean = false;
  getUserSelect(ev) {
    let contact = this.allUsers.find(
      (data) => data.contact == ev.target.value
    ).contact;
    console.log('contact' + contact);
    if (ev.target.checked == true) {
      // this.deliveryIds.push(ev.target.value);
      this.userSelect.push(contact);
    } else {
      for (let i = 0; i < this.userSelect.length; i++) {
        if (this.userSelect[i] == contact) {
          this.userSelect.splice(i, 1);
        }
      }
      // for (let i = 0; i < this.deliveryIds.length; i++) {
      //   if (this.deliveryIds[i] == ev.target.value) {
      //     this.deliveryIds.splice(i, 1);
      //   }
      // }
    }
  }

  selectedAllApply() {
    if (this.selectedAll) {
      // this.allStatus = false;
      this.selectAll();
    } else {
      // this.allStatus = true;
      this.deSelectAll();
    }
  }

  allStatus = false;
  selectAll() {
    this.userSelect = [];
    $('input:checkbox:not("#parent-box")').each(function () {
      this.checked = false;
    });
    if (this.allStatus === false) {
      for (let j = 0; j < this.allUsers.length; j++) {
        this.userSelect.push(this.allUsers[j].contact);
        // this.deliveryIds.push(this.allUsers[j].deliveries.id)
      }
      this.allStatus = true;
    }
    $('input:checkbox:not("#parent-box")').each(function () {
      if (this.checked) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    });
  }

  deSelectAll() {
    if (this.allStatus === true) {
      this.userSelect = [];
      // this.deliveryIds = [];
      this.allStatus = false;
    }

    $('input:checkbox:not("#parent-box")').each(function () {
      this.checked = true;
    });

    $('input:checkbox:not("#parent-box")').each(function () {
      if (this.checked) {
        this.checked = false;
      } else {
        this.checked = true;
      }
    });
  }

  checkAll(e) {
    let isChecked = e.target.checked;
    $('input:checkbox:not("#parent-box")').prop('checked', isChecked);
    this.selectedAllApply();
  }

  singleCheck(e) {
    let ele = $('input:checkbox:not("#parent-box")');
    let chkFlg = 1;
    for (let i = 0; i < ele.length; i++) {
      chkFlg *= ele[i].checked ? 1 : 0;
    }
    $('input#parent-box').prop('checked', chkFlg);
    this.allStatus = false;
    this.getUserSelect(e);
  }

  //get review contact no
  getReviewContact(user) {
    var keys = Object.keys(user);
    const key = 'phone_0';
    const result = this.startsWith(keys, key);
    let index = keys.findIndex((data) => data == result);
    let keyVal = Object.values(user)[index];
    let value = keyVal.toString();
    const content = value.split(';');
    return content[0];
  }

  startsWith(array, key) {
    const matcher = new RegExp(`^${key}`, 'g');
    return array.filter((word) => word.match(matcher));
  }

  sendSms(data) {
    this.router.navigate(['/home/sms', data.contact]);
  }
}
