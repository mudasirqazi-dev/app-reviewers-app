import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError, observable } from 'rxjs';
import { ApiService } from '../../core/services/index';

@Injectable({ providedIn: 'root' })
export class accountService {
  constructor(
    private _api: ApiService,
    private router: Router,
    private http: HttpClient
  ) {}

  //get user account
  getUserAccount(id: string) {
    return this._api.get(`${'account/byUserId/' + id}`).pipe(
      map((res: any) => res),
      catchError((error: any) => 'Empty')
    );
  }

  //get user account
  getCost() {
    return this._api.get('account/cost/');
  }
}
