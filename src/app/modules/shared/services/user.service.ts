import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, observable } from 'rxjs';
import { ApiService } from '../../core/services/index';

@Injectable({ providedIn: 'root' })
export class userService {
  constructor(
    private _api: ApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  //register new user
  registerNewUser(data) {
    return this._api.post(`${'users/save'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => error)
    );
  }

  //login user
  loginUser(data) {
    return this._api.post(`${'users/login'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //get user by id
  getUserById(userId: string) {
    return this._api.get(`${'users/byId/' + userId}`).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //update user profile
  updateUserProfile(userId: string, data) {
    return this._api.put(`${'users/update/profile/' + userId}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //update user password
  updateUserPassword(data: any) {
    return this._api.put(`${'users/changePassword'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //reset forgot  password
  resetForgotPassword(data: any) {
    return this._api.post(`${'users/resetforgotPassword'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //verify user email
  verifyUserEmail(data: any) {
    return this._api.patch(`${'users/email/verify'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //forget password
  forgetPassword(data) {
    return this._api.post(`${'users/forgotPassword'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //validate token
  validateToken(data) {
    return this._api.post(`${'users/validateToken'}`, data).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  // handleError(error) {
  //     let errorMessage = '';
  //     if (error.error instanceof ErrorEvent) {
  //         // client-side error
  //         errorMessage = Error: ${ error.error.message };
  //     } else {
  //         // server-side error
  //         errorMessage = Error Code: ${ error.status } \nMessage: ${ error.message };
  //     }
  //     window.alert(errorMessage);
  //     return throwError(errorMessage);
  // }
}
