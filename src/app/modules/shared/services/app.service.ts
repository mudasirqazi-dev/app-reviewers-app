import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';

@Injectable({ providedIn: 'root' })
export class appService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient) { }


    //search all app reviews
    searchAppReviews(userId: string, text: string) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('userId', userId)
        httpParams = httpParams.append('searchText', text)
        return this._api.get(`${"apps/search?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => 'Empty')
            );
    }

    //view all users details
    viewUserDetails(userId: string) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('userId', userId)
        return this._api.get(`${"apps/search/detail?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => 'Empty')
            );
    }


}

