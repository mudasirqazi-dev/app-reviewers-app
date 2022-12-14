import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { sms } from './../models/sms';
import { smsService } from './../../shared/services/sms.service';
import { Data } from './../../shared/services/shareDataService';
import { alert } from './../../shared/services/sweetAlert.service';

@Component({
  templateUrl: './sendMessage.component.html',
  styleUrls: ['./sendMessage.component.scss'],
})
export class sendMessageComponent implements OnInit {

  sms = new sms();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private smsService: smsService,
    private alert: alert,
    private data: Data

  ) { }

  ngOnInit() {
    let contact = this.route.snapshot.params['contact'];
    if (contact) {
      this.sms.to = contact;
      // this.sms.to = '923142038799'
    } else {
      this.data.goBack();
    }
  }



  sendSms() {
    this.smsService.sendSms(this.sms).subscribe(res => {
      this.alert.responseAlert(res.message, 'success');
    })
  }
}
