import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/bills`);
  }

  delete(billnum): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}tax-invoice/bill`, {
      params: {
        "billnum" : billnum
      }
    });
  }
}
