import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyStockCandlesService {

  constructor(
    private crud: CrudService
  ) {}

  data = {
    "company_name": "",
    "data": true,
    "c": [],
    "h": [],
    "l": [],
    "o": [],
    "s": "ok",
    "t": [],
    "v": []
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }

  private _company_stock_candles_result = new BehaviorSubject(this.data);
  readonly company_stock_candles$ = this._company_stock_candles_result.asObservable();

  ticker = "";

  get_values() {
    return this._company_stock_candles_result.getValue();
  }

  reset_state() {
    this._company_stock_candles_result.next(
      {
        "company_name": "",
        "data": true,
        "c": [],
        "h": [],
        "l": [],
        "o": [],
        "s": "ok",
        "t": [],
        "v": []
      }
    );
  }

  private set_values(val) {
    this._company_stock_candles_result.next(val);
  }

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name;
    this.set_values(this.error_data);
  }

  check_valid_data_present(ticker) {
    var cur_data = this._company_stock_candles_result["_value"];
    console.log("CompanyStockCandlesService check_valid_data_present cur_data: " + JSON.stringify(cur_data));
    if (cur_data["data"] && !("error" in cur_data) && cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;

  }

  get_company_stock_candles(ticker, resolution, from, to, autorefresh=false) {
    console.log("CompanyStockCandlesService get_company_stock_candles autorefresh: " + autorefresh);
    if (!autorefresh && this.check_valid_data_present(ticker)) {
      console.log(`CompanyStockCandlesService already has data for the ticker: ${ticker}. Will return.`);
      this.set_values(this._company_stock_candles_result.getValue());
      return;
    }

    this.ticker = ticker.toUpperCase();

    console.log(`CompanyStockCandlesService doesn't have data for the ticker: ${ticker}. Will fetch from backend and return.`)

    this.crud.get_company_stock_candles_data(ticker, resolution, from, to).subscribe(data => {
      console.log(`CompanyStockCandlesService Current ticker: ${this.ticker}`);
      console.log(`CompanyStockCandlesService Company from the API result is: ${data.company_name}`);
      if (data.company_name != this.ticker) {
        console.log("CompanyStockCandlesService Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("CompanyStockCandlesService The result from get_company_stock_candles_data: " + JSON.stringify(data));

      this.update_values_from_data(data);

    });
  }

  update_values_from_data(data) {
    var company_name = data.company_name;
    data = data.message;
    var temp_data = {
      "company_name": company_name,
      "data": true,
      "c": data.c,
      "h": data.h,
      "l": data.l,
      "o": data.o,
      "s": "ok",
      "t": data.t,
      "v": data.v
    }

    this.set_values(temp_data);
  }
}
