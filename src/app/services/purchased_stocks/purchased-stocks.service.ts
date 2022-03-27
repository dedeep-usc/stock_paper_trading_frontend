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
}
