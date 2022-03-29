import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPriceService {

  constructor(
    private crud: CrudService
  ) { }

  data = {
    "company_name": "",
    "data": true,
    "c": 0,
    "d": 0,
    "dp": 0,
    "h": 0,
    "l": 0,
    "o": 0,
    "pc": 0,
    "t": 0 
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }

  private _company_price_result = new BehaviorSubject(this.data);
  readonly company_price$ = this._company_price_result.asObservable();

  ticker = "";

  get_values() {
    return this._company_price_result.getValue();
  }

  reset_state() {
    console.log("Resetting state of CompanyPriceService")
    this._company_price_result.next({
      "company_name": "",
      "data": true,
      "c": 0,
      "d": 0,
      "dp": 0,
      "h": 0,
      "l": 0,
      "o": 0,
      "pc": 0,
      "t": 0 
    });
  }

  private set_values(val) {
    this._company_price_result.next(val);
  }

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name;
    this.set_values(this.error_data);
  }

  get_company_price(ticker) {
    console.log("CompanyPriceService get_company_price ticker: " + ticker);
    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanyPriceService already has data for the ticker: ${ticker}. Will return.`);
      return;
    }

    this.ticker = ticker.toUpperCase();

    console.log(`CompanyPriceService doesn't have data for the ticker: ${ticker}. Will fetch from backend and return.`);

    this.crud.get_company_latest_price(this.ticker).subscribe(data => {

      console.log(`CompanyPriceService Current ticker: ${this.ticker}`);
      console.log(`CompanyPriceService Company from the API result is: ${data.company_name}`);
      if (data.company_name != this.ticker) {
        console.log("CompanyPriceService Current company is different from the company from the data.")
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("CompanyPriceService The result from get_company_latest_price: " + JSON.stringify(data));

      // console.log("Current ticker: " + this.ticker);
      // console.log("The company from the result is: " + data.company_name);

      this.update_values_from_data(data);

    })

  }

  update_values_from_data(data) {
    var company_name = data.company_name;
    data = data.message;
    var temp_data = {
      "company_name": company_name,
      "data": true,
      "c": data.c,
      "d": data.d,
      "dp": data.dp,
      "h": data.h,
      "l": data.l,
      "o": data.o,
      "pc": data.pc,
      "t": data.t
    }

    this.set_values(temp_data);
  }

  check_valid_data_present(ticker) {
    var cur_data = this._company_price_result["_value"];
    console.log("CompanyPriceService check_valid_data_present cur_data: " + JSON.stringify(cur_data));
    if (cur_data["data"] && !("error" in cur_data) && cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;

  }

}
