import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}sale-purchase/bills`);
  }

  fetch(customerId: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}customer`, 
    {
      params: {
        "companyName" : customerId,
        "billnum" : customerId,
        "startDate" : customerId,
        "endDate": customerId
      }
    });
  }
}
