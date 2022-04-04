import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from '../shared/crud.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

import { Router } from '@angular/router';
import { StockResultsComponent } from '../stock-results/stock-results.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
  filtered_tickers: any;
  isLoading = false;
  selected_ticker: any = "";
  ticker_value = new FormControl();
  errorMsg = ""
  userClicked = false;
  alerts = [];

  invalid_ticker = {
    type: 'danger',
    message: 'Please enter a valid ticker',
    dismissible: true
  };
  no_data_for_ticker = {
    type: 'danger',
    message: 'No data found. Please enter a valid ticker',
    dismissible: false
  };


  constructor(
    private crud_service: CrudService,
    private router: Router
  ) { }


  close(alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  displayWith(value: any) {
    return value?.symbol || value;
  }

  onSelected() {
    this.filtered_tickers = []
    this.selected_ticker = this.selected_ticker;
    console.log(this.ticker_value);
    this.show_results();
  }

  clear_results () {
    this.alerts = []
    this.filtered_tickers = [];
    if (this.selected_ticker != null) {
      this.selected_ticker = null;
    }
    this.selected_ticker = null;
    // console.log("HELLOOOOOO : " ,this.ticker_value)
    // this.ticker_value.setValue({
    //   "symbol": ""
    // });
    this.isLoading = false;
  }

  show_results() {

    console.log("Show results called.")
    this.isLoading = false;
    this.alerts = []
    this.filtered_tickers = [];
    this.userClicked = true;
    console.log(typeof this.ticker_value.value);
    console.log("The ticker_value is: " + this.ticker_value.value);
    var ticker = "";

    if (this.ticker_value != null && typeof this.ticker_value.value == "string") {
      ticker = this.ticker_value.value;
    }
    else {
      ticker = this.ticker_value.value?.symbol || "";
    }

    console.log(ticker);

    if (ticker == "home" || ticker == "" || ticker == null || ticker == "HOME") {
      console.log("ticker is invalid");
      this.handle_errors([this.invalid_ticker])
      return;
    }

    this.router.navigateByUrl("/search/"+ticker.toUpperCase());
    // this.fill_stock_data_in_child(ticker);
    this.autocomplete.closePanel();
  }
  

  handle_errors(error_msg_elems) {
    // this.child.show_stock_results = false;
    this.alerts = error_msg_elems;
  }
  

  ngOnInit() {

    this.ticker_value.valueChanges
      .pipe(
        filter(res => {
          console.log(res);
          this.userClicked = false;
          return res != null && res != ""
        }),
        // distinctUntilChanged(),
        debounceTime(300),
        filter(res => {
          console.log("Checking if user has clicked on enter!")
          return !this.userClicked;
        }),
        tap(() => {
          this.userClicked = false;
          this.errorMsg = "";
          this.filtered_tickers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.crud_service.get_data("/api/finnhub/autocomplete?company_name="+value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        
        console.log(data);

        if ("error" in data) {
          this.filtered_tickers = [];
        }
        else {
          if (! this.userClicked){

            if (this.ticker_value != null && typeof this.ticker_value.value == "string") {
              if (this.ticker_value.value == "") {
                this.filtered_tickers = [];
                return;
              }
            }

            var result = []

            var i = 0;
            for (i=0; i<data["message"]["result"].length; i++) {
              var temp_data = data["message"]["result"][i];

              if (temp_data["symbol"].includes(".")) {
                continue;
              }

              if (temp_data["type"] != "Common Stock") {
                continue;
              }

              result.push(temp_data);

            }
            
            this.filtered_tickers = result;
          }
        }
        
      });
  }
}
