import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PurchasedStocksService {

  constructor() { }

  show_sell_button(ticker) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }
    
    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    if (ticker in stocks_bought.stocks) {
      return true;
    }

    return false;
  }

  get_stock_details(ticker) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    if (!(ticker in stocks_bought.stocks)) {
      console.log("Trying to fetch details of stock not bought.");
      return { ticker: ticker, name: ticker, quantity: 0, total_cost: 0 }
    }

    return stocks_bought.stocks[ticker];
  }

  get_stocks_owned() {
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);
    return stocks_bought.stocks;
    
  }

  buy_stock(ticker, company_name, quantity, current_price) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);
    var stocks_owned = stocks_bought.stocks;
    var money_in_wallet = stocks_bought.money;

    var stock_item;
    if (ticker in stocks_owned) {
      stock_item = stocks_owned[ticker];
    }
    else {
      stock_item = { ticker: ticker, name: company_name, quantity: 0, total_cost: 0 }
    }

    // buy operation
    stock_item.quantity += quantity;
    stock_item.total_cost += current_price * quantity;

    money_in_wallet -= current_price * quantity;

    console.log(
      `Buy purchased stocks service ${ticker} ${quantity}, ${stock_item.quantity} now, totalCost ${stock_item.total_cost}`
    );

    stocks_bought["money"] = money_in_wallet;
    stocks_owned[ticker] = stock_item;

    stocks_bought["stocks"] = stocks_owned;

    window.localStorage.setItem("stocks_bought", JSON.stringify(stocks_bought));
  }

  get_money_in_wallet() {
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }
    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);
    return stocks_bought.money;
  }

  sell_stock(ticker, quantity, current_price) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    if (!(ticker in stocks_bought.stocks)){
      console.log("Trying to sell a stock which you don't own.");
      return;
    }

    var stocks_owned = stocks_bought.stocks;
    var money_in_wallet = stocks_bought.money;
    var stock_item = stocks_owned[ticker];
    var avg_cost = stock_item.total_cost / stock_item.quantity;

    console.log("PurchaseStockService sell avg_cost: " + avg_cost);

    stock_item.quantity -= quantity;
    stock_item.total_cost -= avg_cost * quantity;

    console.log(
      `Sell ${ticker} ${quantity}, ${stock_item.quantity} left, totalCost ${stock_item.total_cost}`
    );

    money_in_wallet += current_price * quantity;
    
    stocks_bought["money"] = money_in_wallet;

    if (stock_item.quantity == 0){
      delete stocks_owned[ticker];
    }
    else {
      stocks_owned[ticker] = stock_item;
    }

    stocks_bought["stocks"] = stocks_owned;

    window.localStorage.setItem("stocks_bought", JSON.stringify(stocks_bought));
  }

  stocks_present() {
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify({"money": 25000, "stocks": {}}));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    // return watchlist.length > 0;
    console.log(Object.keys(stocks_bought.stocks).length);
    return Object.keys(stocks_bought.stocks).length > 0;
  }
}
