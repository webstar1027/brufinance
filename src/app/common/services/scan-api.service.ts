import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanApiService {
  basePolygonUrl = '';

  constructor(private http: HttpClient) {
    this.basePolygonUrl = 'https://api.covalenthq.com/v1';
  }

  getTransactions(address: string): Observable<any> {
    return this.http.get(
        ` ${this.basePolygonUrl}/80001/address/${address}/transactions_v2/?key=ckey_6677da61b81f4267ad4129b1905`,
      )   
  }
}
