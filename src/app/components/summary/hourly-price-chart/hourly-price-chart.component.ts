import { Component, OnInit } from '@angular/core';
// import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { CompanyPriceService } from 'src/app/services/company_price/company-price.service';
import { CompanyStockCandlesService } from 'src/app/services/company_stock_candles/company-stock-candles.service';

@Component({
  selector: 'app-hourly-price-chart',
  templateUrl: './hourly-price-chart.component.html',
  styleUrls: ['./hourly-price-chart.component.css']
})
export class HourlyPriceChartComponent implements OnInit {

  // hourly_price_details = {
  //   "chart_title": "RIVN Hourly Price Variation",
  //   "change_positive": true,
  //   "change": -0.11,
  //   "price_data": [
  //     [1645137000*1000, 169],
  //     [1645137300*1000, 168.99],
  //     [1645137900*1000, 168.95],
  //     [1645138500*1000, 168.95],
  //     [1645138800*1000, 168.87],
  //     [1645139100*1000, 168.81],
  //     [1645139400*1000, 168.88],
  //     [1645139700*1000, 169],
  //     [1645140000*1000, 169.09],
  //     [1645140300*1000, 169.03]
  //   ]
  // };
  
  hourly_price_details = {
    "chart_title": "",
    "change_positive": true,
    "change": 0,
    "price_data": []
  };

  show_chart_flag = false;

  highcharts = Highcharts;

  // chartOptions: Highcharts.Options = {
  //     title: {
  //         text: `<div style="color:#737373">${this.hourly_price_details.chart_title}</div>`,
  //         useHTML: true,
  //     },
  //     chart: {
  //         marginRight: 20,
  //         marginLeft: 20
  //     },
  //     xAxis: {
  //         type: 'datetime',
  //         scrollbar: {
  //             enabled: true
  //         }
  //     },
  //     yAxis: [{
  //         labels: {
  //             align: 'right',
  //         },
  //         title: {
  //             text: '',
  //         },
  //         opposite: true,
  //     }],
  //     legend: {
  //         enabled: false
  //     },
  //     series: [{
  //         type: 'line',
  //         name: 'Stock Price',
  //         // data: this.hourly_price_details.summary.chart.data.map(([date, value]) => {
  //         //     return [date, value]
  //         // }),
  //         data: this.hourly_price_details.price_data,
  //         // color: this.hourly_price_details.change_positive ? "var(--bs-success)" : "var(--bs-danger)",
  //         color: this.line_color(this.hourly_price_details.change),
  //         marker: {
  //             enabled: false
  //         },
  //         threshold: null
  //     }]
  // }

  chartOptions = null;

  line_color(change) {
    if (change == null || change == "") {
      change = 0;
    }

    change = parseFloat(change);

    if (change > 0) {
      return "var(--bs-success)";
    }
    else if (change < 0) {
      return "var(--bs-danger)"
    }

    return "black";

  }

  constructor(
    public company_stock_candles_service: CompanyStockCandlesService,
    public company_price_service: CompanyPriceService,
  ) { }

  ngOnInit(): void {
    this.company_price_service.company_price$.subscribe((data) => {
      this.company_latest_price_subscribe_data(data);
    });

    this.company_stock_candles_service.company_stock_candles$.subscribe((data) => {
      this.company_stock_candles_subscribe_data(data);
    });

    Highcharts.setOptions({
      time: {
          timezoneOffset: 7*60
      }
    });
  }

  handle_error() {
    this.hourly_price_details = {
      "chart_title": "",
      "change_positive": true,
      "change": 0,
      "price_data": []
    };
  }

  company_latest_price_subscribe_data(data) {
    console.log("HourlyPriceChartComponent company_latest_price_subscribe_data subscribe data: " + JSON.stringify(data));
    
    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.hourly_price_details["change"] = data.d;

  }

  form_stock_candles_data(close_price, timestamp) {
    var res = [];
    var i;

    for (i=0; i<close_price.length; i++) {
      res.push([timestamp[i] * 1000, close_price[i]])
    }

    return res;
  }

  company_stock_candles_subscribe_data(data) {
    console.log("HourlyPriceChartComponent company_stock_candles_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.hourly_price_details["chart_title"] = `${data.company_name} Hourly Price Variation`;
    console.log("HourlyPriceChartComponent afaffaga" + JSON.stringify(this.hourly_price_details));
    
    // Highcharts.setOptions({
    //   time: {
    //       timezoneOffset: 7*60
    //   }
    // });
    
    this.chartOptions = {
          title: {
              text: `<div style="color:#737373; font-size: 1.5vh">${this.hourly_price_details.chart_title}</div>`,
              useHTML: true,
          },
          chart: {
              marginRight: 20,
              marginLeft: 20
          },
          xAxis: {
              type: 'datetime',
              useUTC: false,
              scrollbar: {
                  enabled: true
              }
          },
          yAxis: [{
              labels: {
                  align: 'right',
              },
              title: {
                  text: '',
              },
              opposite: true,
          }],
          legend: {
              enabled: false
          },
          series: [{
              type: 'line',
              name: 'Stock Price',
              // data: this.hourly_price_details.summary.chart.data.map(([date, value]) => {
              //     return [date, value]
              // }),
              // data: this.hourly_price_details.price_data,
              data: this.form_stock_candles_data(data.c, data.t),
              // color: this.hourly_price_details.change_positive ? "var(--bs-success)" : "var(--bs-danger)",
              color: this.line_color(this.hourly_price_details.change),
              marker: {
                  enabled: false
              },
              threshold: null
          }]
      }
  }
}
