import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}formula/fetchAll`);
  }

  fetch(code: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}formula/fetch`, 
    {
      params: {
        "code" : code
      }
    });
  }

  delete(code: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}formula`, {
      params: {
        "code" : code
      }
    });
  }
}
