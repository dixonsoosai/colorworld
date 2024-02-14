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

  fetchAll(billType: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/bills`, { params: {'billType': billType }});
  }

  fetch(invoice: string, billType: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/bill`, { params: {'billType': billType }});
  }

  fetchBillDetails(invoice: string, billType: string) {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/billDetails`, {params: {"billnum" : invoice, 'billType': billType}});
  }


  generate(taxinvoice, overflowLimit: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}posting/generateBill`, taxinvoice, {params: {"overflowLimit" : overflowLimit}, 
    responseType: 'text'});
  }

  download(taxinvoice): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}posting/downloadBill`, taxinvoice, {responseType: 'text'});
  }
  downloadByBill(billnum: number, overflowLimit: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}posting/downloadBillNum`, {responseType: 'text', 
    params:{"billnum" : billnum, "overflowLimit" : overflowLimit}});
  }

  delete(billnum, billType): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}tax-invoice/bill`, {
      params: {
        "billnum" : billnum,
        'billType': billType
      }
    });
  }

  newInvoice(date, billType: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}tax-invoice/refreshBilNum`, 
      { params: {"billDate" : date, 'billType': billType }});
  }

}
