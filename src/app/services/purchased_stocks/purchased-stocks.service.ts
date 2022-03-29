import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PurchasedStocksService {

  constructor() { }

  show_sell_button(ticker) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify([]));
    }
    
    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    if (stocks_bought.includes(ticker)) {
      return true;
    }

    return false;

  }

  buy_stock(ticker) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify([]));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    stocks_bought.push(ticker);
    window.localStorage.setItem("stocks_bought", JSON.stringify(stocks_bought));
  }

  sell_stock(ticker) {
    ticker = ticker.toUpperCase();
    if (window.localStorage["stocks_bought"] == undefined) {
      window.localStorage.setItem("stocks_bought", JSON.stringify([]));
    }

    var stocks_bought = JSON.parse(window.localStorage["stocks_bought"]);

    if (!stocks_bought.includes(ticker)) {
      console.log("Trying to sell a stock which you don't own.");
      return;
    }

    stocks_bought.splice(stocks_bought.indexOf(ticker), 1);

    window.localStorage.setItem("stocks_bought", JSON.stringify(stocks_bought));
  }
}
