import { Component, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription } from 'rxjs';
import { CompanyAboutComponent } from '../components/summary/company-about/company-about.component';
import { HourlyPriceChartComponent } from '../components/summary/hourly-price-chart/hourly-price-chart.component';
import { TransactionButtonComponent } from '../components/transaction-button/transaction-button/transaction-button.component';
import { PriceSummaryDetailsComponent } from '../price-summary-details/price-summary-details.component';
import { CompanyEarningsService } from '../services/company-earnings/company-earnings.service';
import { CompanyLatestNewsService } from '../services/company-latest-news/company-latest-news.service';
import { CompanyRecommendationTrendsService } from '../services/company-recommendation-trends/company-recommendation-trends.service';
import { CompanySocialSentimentService } from '../services/company-social-sentiment/company-social-sentiment.service';
import { CompanyInfoService } from '../services/company_info/company-info.service';
import { CompanyPeersService } from '../services/company_peers/company-peers.service';
import { CompanyPriceService } from '../services/company_price/company-price.service';
import { CompanyStockCandlesService } from '../services/company_stock_candles/company-stock-candles.service';
import { MainChartStockCandlesService } from '../services/main-chart-stock-candles/main-chart-stock-candles.service';
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
  
  // @ViewChild(PriceSummaryDetailsComponent, {static : true}) price_summary_details_tab : PriceSummaryDetailsComponent;
  // @ViewChild(CompanyAboutComponent, {static : true}) company_about_details_tab : CompanyAboutComponent;
  // @ViewChild(HourlyPriceChartComponent, {static : true}) hourly_price_chart_tab : HourlyPriceChartComponent;

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
    dismissible: false,
  };

  watchlist_test_alert = {
    type: 'success',
    message: 'AAPL removed successfully removed from watchlist.',
    dismissible: true,
    show: false
  };

  self_closing_alerts = {
    "a": this.watchlist_test_alert
  }

  company_info_loaded = false;
  company_latest_price_loaded = false;
  company_peers_loaded = false;
  company_stock_candles_loaded = false;

  get_watchlist_alert_body(ticker, buy) {
    ticker = ticker.toUpperCase();
  
    return {
      type: buy? "success" : "danger",
      message: buy? `${ticker} added to Watchlist.` : `${ticker} removed from Watchlist.`,
      dismissible: true,
      show: true
    }
  }

  get_buy_sell_alert_body(ticker, buy) {
    ticker = ticker.toUpperCase();

    return {
      type: buy? "success" : "danger",
      message: buy? `${ticker} bought successfully.` : `${ticker} sold successfully.`,
      dismissible: true,
      show: true
    }
  }

  // add_to_self_closing_alerts(key, ticker, buy) {
  //   this.self_closing_alerts[key] = this.get_watchlist_alert_body(ticker, buy);
  //   setTimeout(() => this.self_closing_alerts_close(key), 2000);
  // }

  add_to_self_closing_alerts(key, data) {
    this.self_closing_alerts[key] = data;
    setTimeout(() => this.self_closing_alerts_close(key), 2000);
  }

  remove_from_watchlist() {
    var close_alert_key = `${this.ticker}_watchlist_remove`;
    // this.add_to_self_closing_alerts(close_alert_key, this.ticker, false);
    var alert_data = this.get_watchlist_alert_body(this.ticker, false);
    this.add_to_self_closing_alerts(close_alert_key, alert_data);
    this.watchlist_service.remove_from_watchlist(this.ticker);
  }

  add_to_watchlist() {
    var close_alert_key = `${this.ticker}_watchlist_add`;
    // this.add_to_self_closing_alerts(close_alert_key, this.ticker, true);
    var alert_data = this.get_watchlist_alert_body(this.ticker, true);
    this.add_to_self_closing_alerts(close_alert_key, alert_data);
    this.watchlist_service.add_to_watchlist(this.ticker, this.company_name);
  }

  // buy_stock() {
  //   var close_alert_key = `${this.ticker}_bought`;
  //   var alert_data = this.get_buy_sell_alert_body(this.ticker, true);
  //   this.add_to_self_closing_alerts(close_alert_key, alert_data);
  //   this.purchased_stocks.buy_stock(this.ticker, this.company_name);
  // }

  // sell_stock() {
  //   var close_alert_key = `${this.ticker}_sold`;
  //   var alert_data = this.get_buy_sell_alert_body(this.ticker, false);
  //   this.add_to_self_closing_alerts(close_alert_key, alert_data);
  //   this.purchased_stocks.sell_stock(this.ticker);
  // } 

  show_alerts_from_transaction_button(alert_data) {
    var close_alert_key;
    var alert_data;

    if (alert_data.option.toUpperCase() == "BUY") {
      close_alert_key = `${alert_data.ticker}_bought`;
      alert_data = this.get_buy_sell_alert_body(alert_data.ticker, true);
    }
    else if(alert_data.option.toUpperCase() == "SELL") {
      close_alert_key = `${alert_data.ticker}_sold`;
      alert_data = this.get_buy_sell_alert_body(alert_data.ticker, false);
    }

    this.add_to_self_closing_alerts(close_alert_key, alert_data);
  }

  buy_stock() {
    const transModalRef = this.trans_modal_ref.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = this.ticker;
    transModalRef.componentInstance.name = this.company_name;
    transModalRef.componentInstance.current_price = this.last_price;
    transModalRef.componentInstance.option = "Buy";
    transModalRef.componentInstance.show_alert = true;
    transModalRef.componentInstance.buy_sell_alerts.subscribe((data) => {
      console.log("Showing buy alert");
      this.show_alerts_from_transaction_button(data);
    });

    // var close_alert_key = `${this.ticker}_bought`;
    // var alert_data = this.get_buy_sell_alert_body(this.ticker, true);
    // this.add_to_self_closing_alerts(close_alert_key, alert_data);
  }

  sell_stock() {

    const transModalRef = this.trans_modal_ref.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = this.ticker;
    transModalRef.componentInstance.name = this.company_name;
    transModalRef.componentInstance.current_price = this.last_price;
    transModalRef.componentInstance.option = "Sell";
    transModalRef.componentInstance.show_alert = true;
    transModalRef.componentInstance.buy_sell_alerts.subscribe((data) => {
      console.log("Showing sell alert");
      this.show_alerts_from_transaction_button(data);
    });

    // var close_alert_key = `${this.ticker}_sold`;
    // var alert_data = this.get_buy_sell_alert_body(this.ticker, false);
    // this.add_to_self_closing_alerts(close_alert_key, alert_data);
  }
  
  open_transaction_button(option) {
    const transModalRef = this.trans_modal_ref.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = this.ticker;
    transModalRef.componentInstance.name = this.company_name;
    transModalRef.componentInstance.current_price = this.last_price;
    transModalRef.componentInstance.option = option;
  }

  show_sell_button() {
    return this.purchased_stocks.show_sell_button(this.ticker);
  }


  all_data_loaded() {
    // console.log("this.company_info_loaded: " + this.company_info_loaded);
    // console.log("this.company_latest_price_loaded: " + this.company_latest_price_loaded);
    // console.log("this.company_peers_loaded: " + this.company_peers_loaded);
    return this.company_info_loaded && this.company_latest_price_loaded && this.company_peers_loaded && this.company_stock_candles_loaded;
    // return this.company_info_loaded;
    // return this.company_info_loaded && this.company_latest_price_loaded;
  }

  clear_data_loaded_flags() {
    this.company_info_loaded = false;
    this.company_latest_price_loaded = false;
    this.company_peers_loaded = false;
    this.company_stock_candles_loaded = false;
  }
  
  present_in_watchlist() {
    return this.watchlist_service.present_in_watchlist(this.ticker);
  }
  
  close(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  self_closing_alerts_close(alert) {
    // this.watchlist_alerts.splice(this.watchlist_alerts.indexOf(alert), 1);
    delete this.self_closing_alerts[alert];
  }

  constructor(
    private crud: CrudService,
    private date_service: DateHelperService,
    private purchased_stocks: PurchasedStocksService,
    private watchlist_service: WatchlistService,
    public company_info_service: CompanyInfoService,
    public company_price_service: CompanyPriceService,
    public company_peers_service: CompanyPeersService,
    public company_stock_candles_service: CompanyStockCandlesService,
    public main_chart_stock_candles_service: MainChartStockCandlesService,
    public company_social_sentiment_service: CompanySocialSentimentService,
    public company_recommendation_trends_service: CompanyRecommendationTrendsService,
    public company_earnings_service: CompanyEarningsService,
    public company_latest_news_service: CompanyLatestNewsService,
    private trans_modal_ref: NgbModal
  ) { }
  
  company_info_details = null;
  company_latest_price_results = null;
  
  company_info_subscription : Subscription
  company_price_service_subscription : Subscription
  company_peers_service_subscription : Subscription
  company_stock_candles_service_subscription : Subscription
  main_chart_stock_candles_service_subscription : Subscription
  company_social_sentiment_service_subscription : Subscription
  company_recommendation_trends_service_subscription : Subscription
  company_earnings_service_subscription : Subscription
  company_latest_news_service_subscription : Subscription
  
  auto_refresh_subscription : Subscription = null;

  ngOnInit(): void {
    // console.log("Ollaaa " + this.company_about_details_tab)

    this.company_info_subscription = this.company_info_service.company_info$.subscribe((data) => {
      this.company_info_subscribe_data(data);
    });

    this.company_price_service_subscription = this.company_price_service.company_price$.subscribe((data) => {
      this.company_latest_price_subscribe_data(data);
    });

    this.company_peers_service_subscription = this.company_peers_service.company_peers$.subscribe((data) => {
      this.company_peers_subscribe_data(data);
    });

    this.company_stock_candles_service_subscription = this.company_stock_candles_service.company_stock_candles$.subscribe((data) => {
      this.company_stock_candles_subscribe_data(data);
    });

    this.main_chart_stock_candles_service_subscription = this.main_chart_stock_candles_service.main_chart_stock_candles$.subscribe((data) => {
      this.main_chart_stock_candles_subscribe_data(data);
    });

    this.company_social_sentiment_service_subscription = this.company_social_sentiment_service.company_social_sentiment$.subscribe((data) => {
      this.company_social_sentiment_subscribe_data(data);
    });

    this.company_recommendation_trends_service_subscription = this.company_recommendation_trends_service.company_recommendation_trends$.subscribe((data) => {
      this.company_recommendation_trends_subscribe_data(data);
    });

    this.company_earnings_service_subscription = this.company_earnings_service.company_earnings$.subscribe((data) => {
      this.company_earnings_subscribe_data(data);
    });

    this.company_latest_news_service_subscription = this.company_latest_news_service.company_latest_news$.subscribe((data) => {
      this.company_latest_news_subscribe_data(data);
    });

  };

  ngOnDestroy(): void {
    // this.company_info_service.reset_state();
    console.log("Will destroy subscription for company info")
    this.company_info_subscription.unsubscribe();
    this.company_price_service_subscription.unsubscribe();
    this.company_peers_service_subscription.unsubscribe();
    this.company_stock_candles_service_subscription.unsubscribe();
    this.main_chart_stock_candles_service_subscription.unsubscribe();
    this.company_social_sentiment_service_subscription.unsubscribe();
    this.company_recommendation_trends_service_subscription.unsubscribe();
    this.company_earnings_service_subscription.unsubscribe();
    this.company_latest_news_service_subscription.unsubscribe();
    
    // autorefresh
    this.clear_auto_refresh_subscription();
  }

  reset_state_services() {
    this.company_info_service.reset_state();
    this.company_price_service.reset_state();
    this.company_peers_service.reset_state();
    this.company_stock_candles_service.reset_state();
    this.main_chart_stock_candles_service.reset_state();
    this.company_social_sentiment_service.reset_state();
    this.company_recommendation_trends_service.reset_state();
    this.company_earnings_service.reset_state();
    this.company_latest_news_service.reset_state();
  }

  remove_error() {
    this.error = false;
    this.alerts = [];
  }

  handle_error() {
    this.error = true;
    this.alerts = [this.no_data_for_ticker];
    this.reset_state_services();
    this.clear_auto_refresh_subscription();
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
    // this.company_about_details_tab.company_about_details["ipo_start_date"] = data.ipo;
    // this.company_about_details_tab.company_about_details["industry"] = data.finnhubIndustry;
    // this.company_about_details_tab.company_about_details["webpage"] = data.weburl;
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

    this.last_price = data.c?.toFixed(2);
    this.price_change = data.d?.toFixed(2);
    this.price_change_percent = data.dp?.toFixed(2);
    // this.price_time = this.date_service.get_homepage_format(this.date_service.convert_unix_time_stamp(data.t));
    this.price_time = this.date_service.get_homepage_format(new Date());
    this.handle_price_change(data.d);
    this.handle_market_open_close(data.t);

    if (this.date_service.check_market_open(data.t)){
      console.log("Market open. Setting up auto refresh.")
      this.add_auto_refresh();
    }
    
  }

  add_auto_refresh() {
    if (this.auto_refresh_subscription == null) {
      console.log("Adding auto refresh")
      const source = interval(15000);
      this.auto_refresh_subscription = source.subscribe((val) => 
      { 
        if (this.ticker == "HOME" || this.ticker == "home"){
          return;
        }
        console.log("Autofresh happening.")
        this.company_price_service.get_company_price(this.ticker, true);
      })
    }
  }

  clear_auto_refresh_subscription() {
    if (this.auto_refresh_subscription != null) {
      console.log("Stop auto refresh!")
      this.auto_refresh_subscription.unsubscribe();
      this.auto_refresh_subscription = null;
    }
  }

  get_stock_data_new(ticker) {
    this.clear_data_loaded_flags();
    this.remove_error();
    this.remove_loaded_data();
    this.clear_auto_refresh_subscription();

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

    this.call_stock_candles_api(data.t, data.autorefresh);
  
  }

  call_stock_candles_api(unix_epoch_time, autorefresh) {
    console.log("Calling stock candles api.")
    var to = null;
    var from = null;
    var resolution = 5;
    if (this.date_service.check_market_open(unix_epoch_time)) {
      // call 6 hours from current time
      console.log("Market open. Will call stock candles api with current time.");
      to = Math.floor(this.date_service.get_current_unix_epoch_time_in_seconds());
      from = Math.floor(this.date_service.get_x_hours_behind(to, 6));
      resolution = 5;
    }
    else{
      // call 6 hours from unix_epoch_time
      console.log("Market closed. Will call stock candles api with unix_epoch_time");

      to = unix_epoch_time;
      from = Math.floor(this.date_service.get_x_hours_behind(to, 6));
      resolution = 5;
    }
    console.log(`resolution: ${resolution}, from: ${from}, to: ${to}, ticker: ${this.ticker}`)
    this.company_stock_candles_service.get_company_stock_candles(this.ticker, resolution, from, to, autorefresh);
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

    // start calling other apis
    console.log("Company quote api successful. Will call other apis.")
    // this.company_price_service.get_company_price(this.ticker);
    this.company_peers_service.get_company_peers(this.ticker);
    this.call_main_chart_stock_candles_api(this.ticker);
    this.company_social_sentiment_service.get_company_social_sentiment(this.ticker);
    this.company_recommendation_trends_service.get_company_recommendation_trends(this.ticker);
    this.company_earnings_service.get_company_earnings(this.ticker);
    this.call_latest_news_api(this.ticker);
  }

  call_latest_news_api(ticker) {
    var to = null;
    var from  = null;
    var cur_date = new Date();

    to = this.date_service.get_news_date_format(cur_date);
    cur_date = this.date_service.subtract_days_from_date(cur_date, 7);
    from = this.date_service.get_news_date_format(cur_date);

    console.log(`call_latest_news_api to: ${to}, cur_date: ${cur_date}, from: ${from}.`)
    this.company_latest_news_service.get_company_latest_news(ticker, from, to);
  }

  call_main_chart_stock_candles_api(ticker) {
    var to = null;
    var from = null;
    var cur_date = new Date();
    var resolution = "D";

    to = Math.floor(this.date_service.get_current_unix_epoch_time_in_seconds_from_time(cur_date));
    from = Math.floor(this.date_service.subtract_years_from_date(cur_date, 2));

    
    console.log(`call_main_chart_stock_candles_api resolution: ${resolution}, from: ${from}, to: ${to}, ticker: ${this.ticker}`);
    this.main_chart_stock_candles_service.get_company_stock_candles(ticker, resolution, from, to);

  }
  
  company_stock_candles_subscribe_data(data) {
    console.log("The result company_stock_candles_subscribe_data: " + JSON.stringify(data));

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

    this.company_stock_candles_loaded = true;
  }

  main_chart_stock_candles_subscribe_data(data) {
    console.log("The result from main_chart_stock_candles_subscribe_data: " + JSON.stringify(data));

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
  }

  company_social_sentiment_subscribe_data(data) {
    console.log("The result from company_social_sentiment_subscribe_data: " + JSON.stringify(data));

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
  }

  company_recommendation_trends_subscribe_data(data) {
    console.log("The result from company_recommendation_trends_subscribe_data: " + JSON.stringify(data));

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


  }

  company_earnings_subscribe_data(data) {
    console.log("The result from company_earnings_subscribe_data: " + JSON.stringify(data));

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
  }

  company_latest_news_subscribe_data(data){
    console.log("The result from company_latest_news_subscribe_data: " + JSON.stringify(data));

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
  }

  company_peers_subscribe_data(data) {
    console.log("The result company_peers_subscribe_data: " + JSON.stringify(data));

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

    this.company_peers_loaded = true;

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
