import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/shared/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPeersService {

  constructor(
    private crud: CrudService
  ) { }

  data = {
    "company_name": "",
    "data": true,
    "peers": []
  }

  error_data = {
    "error": true,
    "reason": "",
    "company_name": "",
    "data": true
  }

  private _company_peer_result = new BehaviorSubject(this.data);
  readonly company_peers$ = this._company_peer_result.asObservable();

  ticker = "";

  get_values() {
    return this._company_peer_result.getValue();
  }

  reset_state() {
    return this._company_peer_result.next({
      "company_name": "",
      "data": true,
      "peers": []
    });
  }

  private set_values(val) {
    this._company_peer_result.next(val);
  } 

  handle_error(data) {
    this.error_data["reason"] = data.message;
    this.error_data["company_name"] = data.company_name;
    this.set_values(this.error_data);
  }

  update_values_from_data(data) {
    var company_name = data.company_name;
    data = data.message;

    var temp_data = {
      "company_name": company_name,
      "data": true,
      "peers": data
    }

    this.set_values(temp_data);
  }

  get_company_peers(ticker) {

    if (this.check_valid_data_present(ticker)) {
      console.log(`CompanyPeersService already has data for the ticker: ${ticker}. Will return.`);
      this.set_values(this._company_peer_result.getValue());
      return;
    }

    this.ticker = ticker.toUpperCase();

    console.log(`CompanyPeersService doesn't have data for the ticker: ${ticker}. Will fetch from backend and return.`);

    this.crud.get_company_peers(this.ticker).subscribe(data => {
      console.log(`Current ticker: ${this.ticker}`);
      console.log(`Company from the API result is: ${data.company_name}`);
      if (data.company_name != this.ticker) {
        console.log("Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error(data);
        return;
      }

      console.log("The result from get_company_peers: " + JSON.stringify(data));

      this.update_values_from_data(data);

    });

  }

  check_valid_data_present(ticker) {
    var cur_data = this._company_peer_result["_value"];

    if (cur_data["data"] && !("error" in cur_data) && cur_data["company_name"] == ticker.toUpperCase()) {
      return true;
    }

    return false;

  }

}
