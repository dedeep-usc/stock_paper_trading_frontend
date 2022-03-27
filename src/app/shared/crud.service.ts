import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  endpoint = 'http://localhost:9080';
  constructor(private http_client: HttpClient) {}

  get_data(url): any {
    var final_url = this.endpoint + url;
    console.log(url);

    return this.http_client.get(final_url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return of<any>({result: [], error: "No data found", company_name: error.error.company_name})
  }

  get_company_info(ticker): any {
    var final_url = this.endpoint + "/api/finnhub/get/company/info?company_name=" + ticker;
    console.log("get_company_info final_url: " + final_url);
    return this.http_client.get(final_url).pipe(
      catchError(this.handleError)
    );
  }

  get_company_latest_price(ticker): any {
    var final_url = this.endpoint + "/api/finnhub/get/company/latest/price?company_name=" + ticker;
    console.log("get_company_latest_price final_url: " + final_url);
    return this.http_client.get(final_url).pipe(
      catchError(this.handleError)
    );
  }

}
