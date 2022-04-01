import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchasedStocksService } from 'src/app/services/purchased_stocks/purchased-stocks.service';

@Component({
  selector: 'app-transaction-button',
  templateUrl: './transaction-button.component.html',
  styleUrls: ['./transaction-button.component.css']
})
export class TransactionButtonComponent implements OnInit {

  @Input() public ticker: string;
  @Input() public name: string;
  @Input() public current_price: number;
  @Input() public option: string; // 'Buy' or 'Sell'
  @Input() public money_in_wallet: number
  @Input() public show_alert: boolean
  @Input() public alert_portfolio: boolean
  @Output() buy_sell_success: EventEmitter<any> = new EventEmitter();

  @Output() buy_sell_alerts: EventEmitter<any> = new EventEmitter();

  input_quantity: number = 0;
  purchased_quantity: number = 0;

  constructor(
    private purchased_stocks_service: PurchasedStocksService,
    public trans_modal_service: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.purchased_quantity = this.get_sell_quantity();
  }

  get_sell_quantity() {
    if (this.purchased_stocks_service.show_sell_button(this.ticker)) {
      var stock_details = this.purchased_stocks_service.get_stock_details(this.ticker);
      return stock_details.quantity;
    }

    return 0;
  }

  get_money_in_wallet() {
   return this.purchased_stocks_service.get_money_in_wallet();
  }

  public execute_option(){
    if (this.option.toUpperCase() == "SELL") {
      this.purchased_stocks_service.sell_stock(this.ticker, this.input_quantity, this.current_price);
    }
    else if (this.option.toUpperCase() == "BUY") {
      this.purchased_stocks_service.buy_stock(this.ticker, this.name, this.input_quantity, this.current_price);
    }
    
    if (this.show_alert) {
      console.log("Passing alerts to the parent.");
      this.pass_alerts_to_parent(this.ticker, this.option.toUpperCase());
    }

    if (this.alert_portfolio) {
      console.log("Alerting portfolio component.");
      this.emit_buy_sell_success(this.ticker);
    }


    // console.log("Passing alerts to the parent.");
    //   this.pass_alerts_to_parent(this.ticker, this.option.toUpperCase());
    // TODO: Check the close parameter.
    this.trans_modal_service.close('Cross click');
    
  }

  not_enough_money() {
    if (this.option.toUpperCase() == "SELL"){
      return false;
    }
    return this.input_quantity * this.current_price > this.get_money_in_wallet();
  }

  selling_more_than_owned() {
    if (this.option.toUpperCase() == "BUY") {
      return false;
    }

    return this.purchased_quantity && this.input_quantity > this.purchased_quantity;
  }

  pass_alerts_to_parent(ticker, option) {
    this.buy_sell_alerts.emit(
      {
        "ticker": ticker,
        "option": option
      }
    )
  }

  emit_buy_sell_success(ticker) { 
    this.buy_sell_success.emit(
      {
        "ticker": ticker,
        "buy_sell": true
      }
    )
  }

}
