import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyLatestNewsService {

  constructor(
    private crud: CrudService
  ) { }

  data = {
    "company_name": "",
    "data": true,
    "latest_news": []
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }

  private _company_latest_news_result = new BehaviorSubject(this.data);
  readonly company_latest_news$ = this._company_latest_news_result.asObservable();

  ticker = "";

  get_values() {
    return this._company_latest_news_result.getValue();
  }

  reset_state() {
    this._company_latest_news_result.next({
      "company_name": "",
      "data": true,
      "latest_news": []
    });
  }

  private set_values(val) {
    this._company_latest_news_result.next(val);
  }

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name;
    this.set_values(this.error_data);
  }

  check_valid_data_present(ticker) {
    var cur_data = this._company_latest_news_result["_value"];
    console.log("CompanyLatestNewsService check_valid_data_present cur_data: " + JSON.stringify(cur_data));
    if (cur_data["data"] && !("error" in cur_data) && cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;

  }

  get_company_latest_news(ticker, from, to) {
    console.log("CompanyLatestNewsService get_company_price ticker: " + ticker);
    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanyLatestNewsService already has data for the ticker: ${ticker}. Will return.`);
      this.set_values(this._company_latest_news_result.getValue());
      return;
    }
    this.ticker = ticker.toUpperCase();
    this.crud.get_company_latest_news(ticker, from, to).subscribe(data => {
      console.log(`CompanyLatestNewsService Current ticker: ${this.ticker}`);
      console.log(`CompanyLatestNewsService Company from the API result is: ${data.company_name}`);

      if (data.company_name != this.ticker) {
        console.log("CompanyLatestNewsService Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("CompanyLatestNewsService The result from get_company_latest_price: " + JSON.stringify(data));

      this.update_values_from_data(data);
    })

    


  }

  update_values_from_data(data) {
    var company_name = data.company_name;
    data = data.message;
    var temp_data = {
      "company_name": company_name,
      "data": true,
      "latest_news": data
    }

    this.set_values(temp_data);
  }
  
}
