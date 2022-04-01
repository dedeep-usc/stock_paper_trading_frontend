import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TickerPublisherService } from '../services/ticker-publisher/ticker-publisher.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  constructor(
    public ticker_publisher_service: TickerPublisherService
  ) { }

  ticker_val = "home";
  ticker_publisher_service_subscription : Subscription;

  ngOnInit(): void {
    this.ticker_publisher_service_subscription = this.ticker_publisher_service.current_ticker$.subscribe((data) => {
      this.set_ticker(data);
    })
  }

  set_ticker(ticker) {
    console.log("NavbarComponent(ticker_publish_service) setting ticker to: " + ticker);
    this.ticker_val = ticker;
  }

  ngOnDestroy() {
    if (this.ticker_publisher_service_subscription) {
      this.ticker_publisher_service_subscription.unsubscribe();
      this.ticker_publisher_service_subscription = null;
    }
  }

  add_active() {
    if ( this.ticker_val == "HOME" || this.ticker_val == "home") {
      return "";
    }

    return "active";
  }

}
