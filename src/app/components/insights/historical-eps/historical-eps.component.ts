import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CompanyEarningsService } from 'src/app/services/company-earnings/company-earnings.service';

// import IndicatorsCore from 'highcharts/indicators/indicators';
// IndicatorsCore(Highcharts);

// import VolumeByPrice from 'highcharts/indicators/volume-by-price';
// VolumeByPrice(Highcharts);

@Component({
  selector: 'app-historical-eps',
  templateUrl: './historical-eps.component.html',
  styleUrls: ['./historical-eps.component.css']
})
export class HistoricalEpsComponent implements OnInit {

  chartOptions = null;

  highcharts = Highcharts;

  constructor(
    public company_earnings_service: CompanyEarningsService
  ) { }

  ngOnInit(): void {
    this.company_earnings_service.company_earnings$.subscribe((data) => {
      this.company_earnings_subscribe_data(data);
    });
  }

  handle_error() {
  }

  eps_data(data) {
    var i;

    var categories = [];
    var actuals = [];
    var estimates = [];

    for (i=0; i<data.length;i++) {
      var surprise = data[i].surprise == null ? 0 : data[i].surprise;
      categories.push(data[i].period + ` Surprise: ${surprise}`);
      var actual = data[i].actual == null ? 0 : data[i].actual;
      actuals.push(actual);

      var estimate = data[i].estimate == null ? 0 : data[i].estimate;
      estimates.push(estimate);
    }

    return {
      "categories": categories,
      "actuals": actuals,
      "estimates": estimates
    }

  }

  company_earnings_subscribe_data(data) {
    console.log("HistoricalEpsComponent company_stock_candles_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    var earnings_data = this.eps_data(data.earnings);

    this.chartOptions = {
      chart: {
        
        width: 400,
        height: 300,
        type: 'column'
      },
      title: {
          text: `Historical EPS Surprises`,
      },
      xAxis: {
          type: 'linear',
          scrollbar: {
              enabled: true
          },
          categories: earnings_data.categories
      },
      yAxis: [{
          title: {
              text: 'Quarterly EPS',
          },
      }],
      series: [{
          type: 'spline',
          name: 'Actual',
          data : earnings_data.actuals,
          color: "#7bb5ec",
      }, {
          type: 'spline',
          name: 'Esitmate',
          data: earnings_data.estimates,
          color: "#434343",
      }]
  }

  }

}
