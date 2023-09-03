import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}customers`);
  }

  fetch(customerId: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}customer`, 
    {
      params: {
        "customerId" : customerId
      }
    });
  }

  add(customer: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}customer`, customer);
  }

  delete(customerId: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}customer`, {
      params: {
        "customerId" : customerId
      }
    });
  }
}
