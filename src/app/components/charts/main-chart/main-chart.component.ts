import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { MainChartStockCandlesService } from 'src/app/services/main-chart-stock-candles/main-chart-stock-candles.service';

import IndicatorsCore from 'highcharts/indicators/indicators';
IndicatorsCore(Highcharts);

import VolumeByPrice from 'highcharts/indicators/volume-by-price';
VolumeByPrice(Highcharts);

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css']
})
export class MainChartComponent implements OnInit {

  highcharts = Highcharts;
  show_chart = false;
  chartOptions = null;

  main_chart_data = {
    "volume": [],
    "olhc": [],
    "ticker": ""
  }

  handle_error() {
    this.main_chart_data = {
      "volume": [],
      "olhc": [],
      "ticker": ""
    };
  }

  constructor(
    public main_chart_stock_candles_service: MainChartStockCandlesService
  ) { }

  ngOnInit(): void {
    this.main_chart_stock_candles_service.main_chart_stock_candles$.subscribe((data) => {
      this.main_chart_stock_candles_subscribe_data(data);
    });

    Highcharts.setOptions({
      time: {
          timezoneOffset: 7*60
      }
    });
  }

  form_stock_volume_data(volume, timestamp) {
    var res = [];
    var i;

    for (i=0; i<volume.length; i++) {
      res.push([timestamp[i] * 1000, volume[i]]);
    }

    return res;
  }

  form_stock_olhc_data(timestamp, open, low, high, close) {
    var res = [];
    var i;

    for (i=0; i<timestamp.length; i++) {
      res.push([timestamp[i] * 1000, open[i], low[i], high[i], close[i]]);
    }
    return res;
  }

  main_chart_stock_candles_subscribe_data(data) {
    console.log("MainChartComponent company_latest_price_subscribe_data subscribe data: " + JSON.stringify(data));
    
    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.main_chart_data["ticker"] = data.company_name
    this.main_chart_data["volume"] = this.form_stock_volume_data(data.v, data.t);
    this.main_chart_data["olhc"] = this.form_stock_olhc_data(data.t, data.o, data.l, data.h, data.c);

    this.chartOptions =  {
      chart:{
          // marginLeft:40
      },
      // rangeSelector: {
      //     enabled:true,
      //     // selected: 2
      //   },
      // rangeSelector: {
      //     selected: 5
      // },
      title: {
          // text: data.charts.title
          // text: "VMW Historical"
          text: `${data.company_name} Historical`
      },
  
      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },
  
      xAxis: {
          type: 'datetime',
      },
      
      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          },
          offset:0,
          opposite: true,
      }, {
          labels: {
              align: 'right',
              x: -2
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
          opposite: true,
      }],
  
      legend: {
          enabled: false
      },
      tooltip: {
          split: true
      },
      navigator:{
          enabled:true,
      },
      scrollbar: {
          enabled: true
      },
  
      series: [{
          type: 'candlestick',
          name: data.company_name,
          // name: "AAPL",
          id: 'olhc',
          zIndex: 2,
          data: this.main_chart_data.olhc,
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.main_chart_data.volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'olhc',
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: 'olhc',
          zIndex: 5,
          marker: {
              enabled: false
          }
      }]
    }

    this.show_chart = true;
  }

}
