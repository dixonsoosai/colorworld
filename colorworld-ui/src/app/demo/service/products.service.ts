import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAllProducts() : Observable<any> {
    return this.httpClient.get(this.baseUrl + "products");
  }

  fetchProductByCode(productCode: string): Observable<any> {
    let queryParams = new HttpParams({
    fromObject: {
      "productCode" : productCode
    }});
    return this.httpClient.get(this.baseUrl + "product", {params: queryParams});
  }

  addProduct(productDetails: any): Observable<any> {
    return this.httpClient.put(this.baseUrl + "product", productDetails);
  }

  deleteProductByCode(productCode: string): Observable<any> {
    let queryParams = new HttpParams({
      fromObject: {
        "productCode" : productCode
      }});
      return this.httpClient.delete(this.baseUrl + "products", {params: queryParams});
  }
}
