import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { WatchlistService } from '../services/watchlist/watchlist.service';
import { CrudService } from '../shared/crud.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(
    private watchlist_service: WatchlistService,
    private crud: CrudService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.watchlist = [];
    this.ticker_watchlist_index_mapper = {};
    this.fetch_all_ticker_data();
  }

  ticker_watchlist_index_mapper = {}
  watchlist_key = {}
  watchlist = []
  fetch_finish = false;

  fetch_all_ticker_data() {
    this.watchlist = [];
    this.fetch_finish = false;
    this.ticker_watchlist_index_mapper = {};
    var local_storage_watchlist = this.watchlist_service.get_watchlist();
    let callArr = [];

    for (let ticker in local_storage_watchlist) {
      callArr.push(this.crud.get_company_latest_price(ticker));
    }


    forkJoin(callArr).subscribe((responses) => {
      let infoArr = [];
      var count = 0;
      responses.forEach((data)=> {
        console.log("Watchlist data in responses: " + JSON.stringify(data));
        if ("error" in data) {
          this.handle_error();
          return;
        }
        
        let ticker = data.company_name;
        let company_name = local_storage_watchlist[ticker];
        this.ticker_watchlist_index_mapper[ticker] = count;
        count += 1
        var d = data.message.d == null ? 0 : data.message.d;
        let temp_data = {
          "ticker": ticker,
          "name": company_name,
          "d": data.message.d,
          "c": data.message.c,
          "dp": data.message.dp,
          "price_up_symbol": d > 0 ? true : false,
          "price_down_symbol": d < 0 ? true : false,
          "text_color": this.get_text_color(d)
        }

        infoArr.push(temp_data);
      });

      this.watchlist = infoArr;
      console.log(this.watchlist);
      console.log("AAAAAAA: " + JSON.stringify(this.ticker_watchlist_index_mapper));
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

  watchlist_present(){
    return this.watchlist_service.watchlist_present();
  }

  handle_error() {
    this.watchlist = [];
    this.fetch_finish = false;
    this.ticker_watchlist_index_mapper = {};
  }

  all_data_loaded() {
    return this.fetch_finish;
  }

  removeFromWatchlist(ticker_details) {
    console.log("removeFromWatchlist " + JSON.stringify(ticker_details));
    this.watchlist.splice(this.ticker_watchlist_index_mapper[ticker_details.ticker], 1);
    delete this.ticker_watchlist_index_mapper[ticker_details.ticker];
    this.watchlist_service.remove_from_watchlist(ticker_details.ticker);
    console.log(JSON.stringify(this.ticker_watchlist_index_mapper));
  }

  public linkToDetails(ticker) {
    this.router.navigateByUrl('/search/' + ticker);
  }

}
