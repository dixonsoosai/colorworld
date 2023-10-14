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

  fetch(invoice: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/bill`);
  }

  fetchBillDetails(invoice: string) {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/billDetails`, {params: {"billnum" : invoice}});
  }


  generate(taxinvoice): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}posting/generateBill`, taxinvoice, {responseType: 'text'});
  }

  download(taxinvoice): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}posting/downloadBill`, taxinvoice, {responseType: 'text'});
  }
  downloadByBill(billnum: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}posting/downloadBillNum`, {responseType: 'text', params:{"billnum" : billnum}});
  }

  delete(billnum): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}tax-invoice/bill`, {
      params: {
        "billnum" : billnum
      }
    });
  }

  newInvoice(date): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/refreshBilNum`, {params: {"billDate" : date}});
  }

}
