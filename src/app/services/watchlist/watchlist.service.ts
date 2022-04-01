import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(
  ) { }

  present_in_watchlist(ticker) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify({}));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);

    // if (watchlist.includes(ticker)) {
    //   return true;
    // }

    if (ticker in watchlist) {
      return true;
    }

    return false;

  }

  add_to_watchlist(ticker, company_name) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify({}));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);
    // watchlist.push(ticker);
    watchlist[ticker] = company_name;

    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  remove_from_watchlist(ticker) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify({}));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);

    // if (watchlist.includes(ticker)) {
    //   watchlist.splice(watchlist.indexOf(ticker), 1); 
    // }

    if (ticker in watchlist) {
      delete watchlist[ticker]
    }

    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  watchlist_present() {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify({}));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);

    // return watchlist.length > 0;
    return Object.keys(watchlist).length > 0;
  }

  get_watchlist() {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify({}));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);
    return watchlist;
  }
}
