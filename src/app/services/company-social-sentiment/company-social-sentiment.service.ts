import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanySocialSentimentService {

  constructor(
    private crud: CrudService
  ) { }

  data = {
    "company_name": "",
    "data": true,
    "reddit": [],
    "twitter": [],
    "symbol": []
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }

  private _company_social_sentiment_result = new BehaviorSubject(this.data);
  readonly company_social_sentiment$ = this._company_social_sentiment_result.asObservable();

  ticker = "";

  get_values() {
    return this._company_social_sentiment_result.getValue();
  }

  reset_state() {
    this._company_social_sentiment_result.next({
      "company_name": "",
      "data": true,
      "reddit": [],
      "twitter": [],
      "symbol": []
    });
  }

  private set_values(val) {
    this._company_social_sentiment_result.next(val);
  }

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name;
    this.set_values(this.error_data);
  }

  check_valid_data_present(ticker) {
    var cur_data = this._company_social_sentiment_result["_value"];
    console.log("CompanySocialSentimentService check_valid_data_present cur_data: " + JSON.stringify(cur_data));
    if (cur_data["data"] && !("error" in cur_data) && cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;

  }

  get_company_social_sentiment(ticker) {
    console.log("CompanySocialSentimentService get_company_price ticker: " + ticker);
    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanySocialSentimentService already has data for the ticker: ${ticker}. Will return.`);
      return;
    }

    this.ticker = ticker.toUpperCase();

    this.crud.get_company_social_sentiment(this.ticker).subscribe(data => {
      console.log(`CompanySocialSentimentService Current ticker: ${this.ticker}`);
      console.log(`CompanySocialSentimentService Company from the API result is: ${data.company_name}`);

      if (data.company_name != this.ticker) {
        console.log("CompanyPriceService Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("CompanySocialSentimentService The result from get_company_latest_price: " + JSON.stringify(data));

      this.update_values_from_data(data);
    });
  }

  update_values_from_data(data) {
    var company_name = data.company_name;
    data = data.message;
    var temp_data = {
      "company_name": company_name,
      "data": true,
      "reddit": data.reddit,
      "symbol": data.symbol,
      "twitter": data.twitter
    }

    this.set_values(temp_data);
  }

}
