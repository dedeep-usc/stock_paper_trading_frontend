import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TickerPublisherService {

  constructor() { }

  data = "home"

  private _current_ticker = new BehaviorSubject(this.data);
  readonly current_ticker$ = this._current_ticker.asObservable();


  get_values() {
    return this._current_ticker.getValue();
  }

  reset_state() {
    this._current_ticker.next(this.data);
  }

  private set_values(val) {
    this._current_ticker.next(val);
  }

  set_curreny_ticker(ticker) {
    // this.ticker = ticker.toUpperCase();
    this.set_values(ticker);
  }

}
