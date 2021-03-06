import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { TransactionButtonComponent } from '../components/transaction-button/transaction-button/transaction-button.component';
import { PurchasedStocksService } from '../services/purchased_stocks/purchased-stocks.service';
import { CrudService } from '../shared/crud.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  constructor(
    private purchased_stocks: PurchasedStocksService,
    private crud: CrudService,
    private router: Router,
    private trans_modal_ref: NgbModal
  ) { }
  
  fetch_finish = false;
  stocks_purchased = [];
  ticker_stocks_purchased_index_mapper = {}
  
  watchlist_test_alert = {
    type: 'success',
    message: 'AAPL removed successfully removed from watchlist.',
    dismissible: true,
    show: false
  };

  self_closing_alerts_close(alert) {
    // this.watchlist_alerts.splice(this.watchlist_alerts.indexOf(alert), 1);
    delete this.self_closing_alerts[alert];
  }

  self_closing_alerts = {
    "a": this.watchlist_test_alert
  }

  ngOnInit(): void {
    this.stocks_purchased = [];
    this.ticker_stocks_purchased_index_mapper = {};
    this.fetch_all_ticker_data();
    this.fetch_finish = false;
  }

  linkToDetails(ticker) {
    this.router.navigateByUrl('/search/' + ticker);
  }

  roundTwoDecimals(num: number) {
    return (Math.round(num * 100) / 100)
  }

  fetch_all_ticker_data() {
    this.fetch_finish = false;
    this.stocks_purchased = [];
    this.ticker_stocks_purchased_index_mapper = {};

    var local_storage_stocks_owned = this.purchased_stocks.get_stocks_owned();
    let callArr = [];

    for (let ticker in local_storage_stocks_owned) {
      callArr.push(this.crud.get_company_latest_price(ticker));
    }

    forkJoin(callArr).subscribe((responses) => {
      let infoArr = [];
      var count = 0;

      responses.forEach((data) => {
        console.log("Portfolio data in responses: " + JSON.stringify(data));

        if("error" in data) {
          this.handle_error();
          return;
        }

        let ticker = data.company_name;
        let company_name = local_storage_stocks_owned[ticker].name;

        this.ticker_stocks_purchased_index_mapper[company_name] = count;
        count += 1;

        // var d = data.message.d == null ? 0 : data.message.d;
        var avg_cost = local_storage_stocks_owned[ticker].total_cost / local_storage_stocks_owned[ticker].quantity;
        avg_cost = this.roundTwoDecimals(avg_cost);
        data.message.c = this.roundTwoDecimals(data.message.c);
        var d = data.message.c - avg_cost;
        console.log("DDTEST : " + (avg_cost - data.message.c));
        let temp_data = {
          "name": company_name,
          "ticker": ticker,
          "quantity": local_storage_stocks_owned[ticker].quantity,
          "avg_cost_share": avg_cost,
          "total_cost": avg_cost * local_storage_stocks_owned[ticker].quantity,
          "market_value": local_storage_stocks_owned[ticker].quantity * data.message.c,
          "d": d,
          "c": data.message.c,
          "dp": data.message.dp,
          "price_up_symbol": avg_cost < data.message.c ? true : false,
          "price_down_symbol": avg_cost > data.message.c ? true : false,
          "text_color": this.get_text_color(data.message.c - avg_cost)
        }

        infoArr.push(temp_data);

        console.log("ticker_stocks_purchased_index_mapper: " + this.ticker_stocks_purchased_index_mapper);
      });

      this.stocks_purchased = infoArr;
      this.fetch_finish = true;
    });
  }

  get_text_color(d) {
    if (d == 0) {
      return "";
    }

    if (d > 0) {
      return "text-success";
    }

    if (d < 0) {
      return "text-danger";
    }

    return "";
  }

  handle_error() {
    this.stocks_purchased = [];
    this.ticker_stocks_purchased_index_mapper = {};
    this.fetch_finish = false;
  }

  stocks_bought() {
    return this.purchased_stocks.stocks_present();
  }

  all_data_loaded() {
    return this.fetch_finish;
  }

  get_money_balance() {
    return this.purchased_stocks.get_money_in_wallet();
  }

  open_transaction_button(ticker, name, current_price, option) {
    const trans_modal_ref = this.trans_modal_ref.open(TransactionButtonComponent);
    trans_modal_ref.componentInstance.ticker = ticker;
    trans_modal_ref.componentInstance.name = name;
    trans_modal_ref.componentInstance.current_price = current_price;
    trans_modal_ref.componentInstance.option = option;
    trans_modal_ref.componentInstance.show_alert = true;
    trans_modal_ref.componentInstance.alert_portfolio = true;

    trans_modal_ref.componentInstance.buy_sell_success.subscribe((data) => {
      console.log("Reloading portfiol component;");

      this.fetch_all_ticker_data();

    });

    trans_modal_ref.componentInstance.buy_sell_alerts.subscribe((data) => {
      console.log("Showing buy alert");
      this.show_alerts_from_transaction_button(data);
    });
  }

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

  get_buy_sell_alert_body(ticker, buy) {
    ticker = ticker.toUpperCase();

    return {
      type: buy? "success" : "danger",
      message: buy? `${ticker} bought successfully.` : `${ticker} sold successfully.`,
      dismissible: true,
      show: true
    }
  }

  add_to_self_closing_alerts(key, data) {
    this.self_closing_alerts[key] = data;
    setTimeout(() => this.self_closing_alerts_close(key), 2000);
  }

}
