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
    "message": {
        "country": "",
        "currency": "",
        "exchange": "",
        "finnhubIndustry": "",
        "ipo": "",
        "logo": "",
        "marketCapitalization": 0,
        "name": "",
        "phone": "",
        "shareOutstanding": 0,
        "ticker": "",
        "weburl": ""
    },
    "company_name": "",
    "data": false
  }

  private readonly _company_info_result = new BehaviorSubject(this.data);
  readonly company_info$ = this._company_info_result.asObservable();
  ticker = "";

  check_valid_data_present(ticker) {
    // if (this._company_info_result["data"] && !("error" in this._company_info_result["data"]) &&  this._company_info_result["data"]["company"] == ticker.toUpperCase) {
    //   return true;
    // }

    if (this._company_info_result["data"] && !("error" in this._company_info_result["data"]) &&  this.ticker.toUpperCase == ticker.toUpperCase) {
      return true;
    }

    return false;
  }

  get_values() {
    return this._company_info_result.getValue();
  }

  private set_values(val) {
    this._company_info_result.next(val);
  }

  get_company_info(ticker, success_function, error_function) {
    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanyInfoService already has data for the ticker: ${ticker}. Will return.`);

      return;
    }
    
    this.ticker = ticker.toUpperCase();

    console.log(`CompanyInfoService doesn't have data for the ticker: ${ticker}. Will fetch from backend and return.`);

    this.crud.get_company_info(ticker).subscribe(data => {
      if (data.company_name != this.ticker) {
        console.log("Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        error_function();
        return;
      }

      console.log("The result from get_company_info: " + JSON.stringify(data));

      console.log("Current ticker: " + this.ticker);
      console.log("The company from the result is: " + data.company_name);

      data["data"] = true;
      this.set_values(data);
      success_function();
      
    });

  }
}
