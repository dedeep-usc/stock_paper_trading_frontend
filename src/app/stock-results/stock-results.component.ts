import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyInfoService } from '../services/company_info/company-info.service';
import { CompanyPriceService } from '../services/company_price/company-price.service';
import { PurchasedStocksService } from '../services/purchased_stocks/purchased-stocks.service';
import { WatchlistService } from '../services/watchlist/watchlist.service';
import { CrudService } from '../shared/crud.service';
import { DateHelperService } from '../shared/date-helper.service';

@Component({
  selector: 'app-stock-results',
  templateUrl: './stock-results.component.html',
  styleUrls: ['./stock-results.component.css']
})


export class StockResultsComponent implements OnInit {
  
  ticker = "";
  home_ticker = false;
  error = false;

  company_ticker = "";
  company_name = "";
  company_exchange = "";
  company_logo = "";

  last_price = "";
  price_change = "";
  price_change_percent = "";
  price_time = "";
  market_close_time = "";
  market_open = false;

  price_change_class = {
    "text-success": false,
    "text-danger": false
  }

  market_open_class = {
    "text-success": false,
    "text-danger": false
  }

  price_up_symbol = false;
  price_down_symbol = false;

  alerts = []

  no_data_for_ticker = {
    type: 'danger',
    message: 'No data found. Please enter a valid ticker',
    dismissible: false
  };

  company_info_loaded = false;
  company_latest_price_loaded = false;

  remove_from_watchlist() {
    this.watchlist_service.remove_from_watchlist(this.ticker);
  }

  add_to_watchlist() {
    this.watchlist_service.add_to_watchlist(this.ticker);
  }

  all_data_loaded() {
    return this.company_info_loaded && this.company_latest_price_loaded;
    // return this.company_info_loaded;
  }

  clear_data_loaded_flags() {
    this.company_info_loaded = false;
    this.company_latest_price_loaded = false;
  }

  show_sell_button() {
    return this.purchased_stocks.show_sell_button(this.ticker);
  }

  present_in_watchlist() {
    return this.watchlist_service.present_in_watchlist(this.ticker);
  }
  
  close(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  constructor(
    private crud: CrudService,
    private date_service: DateHelperService,
    private purchased_stocks: PurchasedStocksService,
    private watchlist_service: WatchlistService,
    public company_info_service: CompanyInfoService,
    public company_price_service: CompanyPriceService
  ) { }
  
  company_info_details = null;
  company_latest_price_results = null;
  
  ngOnInit(): void {
    this.company_info_service.company_info$.subscribe((data) => {
      this.company_info_subscribe_data(data);
    });

    this.company_price_service.company_price$.subscribe((data) => {
      this.company_latest_price_subscribe_data(data);
    })
  };

  ngOnDestroy(): void {
    // this.company_info_service.reset_state();
  }

  reset_state_services() {
    this.company_info_service.reset_state();
    this.company_price_service.reset_state();
  }

  remove_error() {
    this.error = false;
    this.alerts = [];
  }

  handle_error() {
    this.error = true;
    this.alerts = [this.no_data_for_ticker];
  }

  remove_loaded_data() {
    this.company_logo = "";
    this.market_close_time = "";
    this.market_open = false;
  }

  reset_price_change_data() {
    this.price_change_class = {
      "text-success": false,
      "text-danger": false
    }
  
    this.price_up_symbol = false;
    this.price_down_symbol = false;
  }

  handle_price_change(price_change) {
    if (price_change == "" || price_change == null) {
      price_change = 0;
    }

    this.reset_price_change_data();

    if (price_change > 0) {
      this.price_change_class = {
        "text-success": true,
        "text-danger": false
      }
      this.price_up_symbol = true;
      this.price_down_symbol = false;
    }
    else if (price_change < 0) {
      this.price_change_class = {
        "text-success": false,
        "text-danger": true
      }
    
      this.price_up_symbol = false;
      this.price_down_symbol = true;
    }
  }

  load_company_info(data) {
    this.company_ticker = data.ticker;
    this.company_name = data.name;
    this.company_exchange = data.exchange;
    this.company_logo = data.logo;
  }

  reset_market_open_flags () {
    this.market_open = false;
    this.market_close_time = "";
    this.market_open_class = {
      "text-success": false,
      "text-danger": false
    }
  }

  handle_market_open_close(unix_epoch_time) {
    this.reset_market_open_flags();
    if (this.date_service.check_market_open(unix_epoch_time)) {
      this.market_open = true;
      this.market_open_class = {
        "text-success": true,
        "text-danger": false
      }
    }
    else {
      this.market_open = false;
      this.market_close_time = this.date_service.get_homepage_format(this.date_service.convert_unix_time_stamp(unix_epoch_time));
      this.market_open_class = {
        "text-success": false,
        "text-danger": true
      }
    }
  }

  load_company_latest_price(data) {

    this.last_price = data.c.toFixed(2);
    this.price_change = data.d.toFixed(2);
    this.price_change_percent = data.dp.toFixed(2);
    // this.price_time = this.date_service.get_homepage_format(this.date_service.convert_unix_time_stamp(data.t));
    this.price_time = this.date_service.get_homepage_format(new Date());
    this.handle_price_change(data.d);
    this.handle_market_open_close(data.t);
  }
  

  get_stock_data_new(ticker) {
    this.clear_data_loaded_flags();
    this.remove_error();
    this.remove_loaded_data();

    this.company_info_service.get_company_info(this.ticker);
    this.company_price_service.get_company_price(this.ticker);
  }

  company_latest_price_subscribe_data(data) {
    this.company_latest_price_results = data;

    console.log("The result company_latest_price_subscribe_data: " + JSON.stringify(data));

    console.log("Current ticker: " + this.ticker);
    console.log("The compnay from the result is: " + data.company_name);

    if (data.company_name != this.ticker) {
      console.log("Current company is different from the company from the data.");
      return;

    }

    if ("error" in data) {
      this.handle_error();
      return;
    }

    this.load_company_latest_price(data);
    this.company_latest_price_loaded = true;
  }

  company_info_subscribe_data(data) {
    this.company_info_details = data;

    console.log("The result company_info_subscribe_data: " + JSON.stringify(data));

    console.log("Current ticker: " + this.ticker);
    console.log("The company from the result is: " + data.company_name);

    if (data.company_name != this.ticker) {
      console.log("Current company is different from the company from the data.");
      return;
    }

    if ("error" in data) {
      this.handle_error();
      return;
    }

    this.load_company_info(data);
    this.company_info_loaded = true;
  }

  get_stock_data(ticker) {
    this.clear_data_loaded_flags();
    this.remove_error();
    this.remove_loaded_data();

    // get company info
    this.crud.get_company_info(ticker).subscribe(data => {
      console.log("The result from get_company_info: " + JSON.stringify(data));

      console.log("Current ticker: " + this.ticker);
      console.log("The company from the result is: " + data.company_name);

      if (data.company_name != this.ticker) {
        console.log("Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error();
        return;
      }

      this.load_company_info(data.message);
      this.company_info_loaded = true;

    });

    // get company latest price
    this.crud.get_company_latest_price(ticker).subscribe(data => {
      console.log("The result from get_company_latest_price: " + JSON.stringify(data));

      console.log("Current ticker: " + this.ticker);
      console.log("The company from the result is: " + data.company_name);

      if (data.company_name != this.ticker) {
        console.log("Current company is different from the company from the data.");
        return;
      }

      if ("error" in data) {
        this.handle_error();
        return;
      }

      this.load_company_latest_price(data.message);
      this.company_latest_price_loaded = true;
    });
  }

}
