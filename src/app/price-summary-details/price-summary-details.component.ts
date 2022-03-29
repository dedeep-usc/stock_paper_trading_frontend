import { Component, OnInit } from '@angular/core';
import { CompanyPriceService } from '../services/company_price/company-price.service';

@Component({
  selector: 'app-price-summary-details',
  templateUrl: './price-summary-details.component.html',
  styleUrls: ['./price-summary-details.component.css']
})
export class PriceSummaryDetailsComponent implements OnInit {

  price_summary_details = {
    "high_price": 0,
    "low_price": 0,
    "open_price": 0,
    "prev_close": 0
  };
  constructor(
    public company_price_service: CompanyPriceService,
  ) { }

  ngOnInit(): void {
    this.company_price_service.company_price$.subscribe((data) => {
      this.company_latest_price_subscribe_data(data);
    });
  }

  company_latest_price_subscribe_data(data) {
    console.log("PriceSummaryDetailsComponent company_info_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.price_summary_details = {
      "high_price": data.h,
      "low_price": data.l,
      "open_price": data.o,
      "prev_close": data.pc
    }
  }

  handle_error() {
    this.price_summary_details = {
      "high_price": 0,
      "low_price": 0,
      "open_price": 0,
      "prev_close": 0
    };
  }

}
