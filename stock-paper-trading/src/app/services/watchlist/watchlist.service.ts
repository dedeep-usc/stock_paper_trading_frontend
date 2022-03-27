import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(
  ) { }

  present_in_watchlist(ticker) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify([]));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);

    if (watchlist.includes(ticker)) {
      return true;
    }

    return false;

  }

  add_to_watchlist(ticker) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify([]));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);
    watchlist.push(ticker);

    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  remove_from_watchlist(ticker) {
    if (window.localStorage["watchlist"] == undefined) {
      window.localStorage.setItem("watchlist", JSON.stringify([]));
    }

    var watchlist = JSON.parse(window.localStorage["watchlist"]);

    if (watchlist.includes(ticker)) {
      watchlist.splice(watchlist.indexOf(ticker), 1); 
    }

    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

}
