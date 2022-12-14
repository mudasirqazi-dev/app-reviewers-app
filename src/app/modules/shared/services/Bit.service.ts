import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService, BitApiService } from '../../core/services/index';

@Injectable({ providedIn: 'root' })
export class BitcoinService {

    constructor(private _api: BitApiService,
        private router: Router,
        private http: HttpClient) { }


    //send sms
    purchase(data) {
        return this._api.post(`${"https://btcpay.prefex.cc/apps/Tz5ArEWtWYMkQb5umw6P4ZoF8gS/pos"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => 'Empty')
            );
    }



}

