import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() { }

  convert_unix_time_stamp(time) {
    var date = new Date(time * 1000);
    console.log("The unix time stamp is: " + date);
    return date;
  }

  get_homepage_format(date) {
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    // 01, 02, 03, ... 10, 11, 12
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    // 1970, 1971, ... 2015, 2016, ...
    var yyyy = date.getFullYear();

    var hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    
    // create the format you want
    
    return (yyyy + "-" + MM + "-" + dd + " " + hours + ":" + minutes + ":" + seconds);
  }

  get_news_date_format(date) {
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    // 01, 02, 03, ... 10, 11, 12
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    // 1970, 1971, ... 2015, 2016, ...
    var yyyy = date.getFullYear();

    return (yyyy + "-" + MM + "-" + dd);
  }

  check_market_open(time) {
    // var request_time = new Date(time * 1000);
    var cur_time = new Date();
    console.log(cur_time.getTime());
    console.log((time)*1000);
    console.log("Time diff: "+(cur_time.getTime() - (time)*1000))
    return cur_time.getTime() - time*1000 < 300000;

  }

  get_current_unix_epoch_time_in_seconds() {
    var cur_time = new Date();
    return cur_time.getTime() / 1000;
  }

  get_current_unix_epoch_time_in_seconds_from_time(time) {
    return time.getTime() / 1000;
  }

  get_x_hours_behind(time, hours) {
    return time - (60*60*hours);
  }

  subtract_years_from_date(date, years) {
    date.setFullYear(date.getFullYear() - years);
    return date.getTime() / 1000;
  }

  subtract_days_from_date(date, days) {
    date.setDate(date.getDate() - days)
    return date;
  }
}
