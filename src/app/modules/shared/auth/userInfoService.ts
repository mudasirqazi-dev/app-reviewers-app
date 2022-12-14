import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { Subject } from "rxjs";
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})

export class UserInfoService {
  authToken;
  user;
  private authStatusListener = new Subject<boolean>();
  constructor(
  ) { }

  // auth listener
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }




  isExpired(exp) {
    if (exp) {
      return exp <= Date.now() / 1000;
    } else {
      return true;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }


  public getAuthData() {
    const token = localStorage.getItem("_auth@");
    if (token) {
      let data = this.getDecodedAccessToken(localStorage.getItem('_auth@'));
      return data._id

    }
  }

  // get user role
  public getUserRole() {
    const token = localStorage.getItem("_auth@");
    if (token) {
      let data = this.getDecodedAccessToken(localStorage.getItem('_auth@'));
      return data.role;

    }
  }



}

