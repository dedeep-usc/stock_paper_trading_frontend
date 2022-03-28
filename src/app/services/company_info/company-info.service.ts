import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {

  constructor(
    private crud: CrudService,
  ) { }
  
  data = {
    "company_name": "",
    "data": true,
    "country": null,
    "currency": null,
    "exchange": null,
    "finnhubIndustry": null,
    "ipo": null,
    "logo": null,
    "marketCapitalization": 0,
    "name": null,
    "phone": null,
    "shareOutstanding": 0,
    "ticker": null,
    "weburl": null,
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }
  
  private _company_info_result = new BehaviorSubject(this.data);
  readonly company_info$ = this._company_info_result.asObservable();
  ticker = "";

  get_values() {
    return this._company_info_result.getValue();
  }

  reset_state() {
    this._company_info_result.next(this.data);
  }

  private set_values(val) {
    // console.log("In set_values = {}")
    this._company_info_result.next(val);
  }

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name
    this.set_values(this.error_data);
  }

  get_company_info(ticker) {
    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanyInfoService already has data for the ticker: ${ticker}. Will return.`);
      return;
    }
    
    this.ticker = ticker.toUpperCase();

    console.log(`CompanyInfoService doesn't have data for the ticker: ${ticker}. Will fetch from backend and return.`);

    this.crud.get_company_info(this.ticker).subscribe(data => {
      if (data.company_name != this.ticker) {
        console.log("Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("The result from get_company_info: " + JSON.stringify(data));

      console.log("Current ticker: " + this.ticker);
      console.log("The company from the result is: " + data.company_name);

      this.update_values_from_data(data);
    });

  }

  update_values_from_data(data) {
    var company_name = data.company_name
    data = data.message;
    var temp_data = {
      "company_name": company_name,
      "data": true,
      "country": data.country,
      "currency": data.currency,
      "exchange": data.exchange,
      "finnhubIndustry": data.finnhubIndustry,
      "ipo": data.ipo,
      "logo": data.logo,
      "marketCapitalization": data.marketCapitalization,
      "name": data.name,
      "phone": data.phone,
      "shareOutstanding": data.shareOutstanding,
      "ticker": data.ticker,
      "weburl": data.weburl,
    }

    this.set_values(temp_data);
  }

  check_valid_data_present(ticker) {

    var cur_data = this._company_info_result["_value"];
    
    if (cur_data["data"] && !("error" in cur_data) &&  cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;
  }
}
