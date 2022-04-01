import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SearchBoxComponent } from '../search-box/search-box.component';
import { TickerPublisherService } from '../services/ticker-publisher/ticker-publisher.service';
import { CrudService } from '../shared/crud.service';
import { StockResultsComponent } from '../stock-results/stock-results.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @ViewChild(StockResultsComponent, {static : true}) stock_results_tab : StockResultsComponent;
  @ViewChild(SearchBoxComponent, {static : true}) search_box : SearchBoxComponent;

  ticker_val: string;
  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    public ticker_publisher_service: TickerPublisherService
    ) { }
  show_stock_results = false;
  show_loader = false;
  
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      console.log("The ticker from the URL is: " + params["ticker"]);
      this.ticker_val = params["ticker"]
      // this.search_box.isLoading = false;
      this.search_box.filtered_tickers = [];
      this.fill_data(this.ticker_val);

      // publish current ticker to ticker publish service
      // this.ticker_publisher_service.set_curreny_ticker(this.ticker_val.toUpperCase());

      var upperCaseTicker = (this.ticker_val == "HOME" || this.ticker_val == "home") ? this.ticker_val : this.ticker_val.toUpperCase();
      
      console.log("Send this to ticker_publish_service: " + upperCaseTicker);
      this.ticker_publisher_service.set_curreny_ticker(upperCaseTicker);

      if (this.ticker_val != "home") {
        this.search_box.ticker_value.setValue({"symbol":this.ticker_val});
        this.search_box.userClicked = true;
      }
      else {
        this.search_box.ticker_value.setValue({"symbol": ""});
        this.search_box.userClicked = true;
      }
    });
  }

  fill_data (ticker) {
    var stock_results_tab = this.stock_results_tab;
    console.log("In fill_data");
    if (ticker == "home" || ticker == "HOME") {
      console.log("Resetting state services.");
      stock_results_tab.reset_state_services();
      stock_results_tab.home_ticker = true;
      stock_results_tab.alerts = [];
      stock_results_tab.ticker = "home";
      this.search_box.ticker_value.setValue({"symbol": ""});
      return;
    }
    
    stock_results_tab.home_ticker = false;
    stock_results_tab.ticker = ticker.toUpperCase();
    // stock_results_tab.get_stock_data(ticker);
    stock_results_tab.get_stock_data_new(ticker);
    // this.search_box.isLoading = false;
    this.search_box.filtered_tickers = [];
  }
}
