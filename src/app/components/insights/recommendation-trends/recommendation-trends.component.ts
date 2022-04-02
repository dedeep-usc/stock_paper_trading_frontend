import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CompanyRecommendationTrendsService } from 'src/app/services/company-recommendation-trends/company-recommendation-trends.service';

@Component({
  selector: 'app-recommendation-trends',
  templateUrl: './recommendation-trends.component.html',
  styleUrls: ['./recommendation-trends.component.css']
})
export class RecommendationTrendsComponent implements OnInit {

  constructor(
    public company_recommendation_trends_service: CompanyRecommendationTrendsService
  ) { }

  ngOnInit(): void {
    this.company_recommendation_trends_service.company_recommendation_trends$.subscribe((data) => {
      this.company_recommendation_trends_subscribe_data(data);
    });
  }

//   chartOptions = {
//     title: {
//         text: `Recommendation Trends`,
//     },
//     chart: {
//         type: 'column'
//     },

//     plotOptions: {
//         series: {
//             stacking: 'normal',
//             dataLabels: {
//                 enabled: true
//             },
//         }
//     },
//     series: data.insights.recommendationTrends.series,
//     xAxis: {
//         categories: data.insights.recommendationTrends.categories
//     },

//     yAxis: {
//         min: 0,
//         title: {
//             text: '#Analysis'
//         },
//     },

// }

  recommendation_trends_details = {
    "categories": [],
    "series": []
  }

  chartOptions = null;

  highcharts = Highcharts;

  handle_error() {
    this.recommendation_trends_details = {
      "categories": [],
      "series": []
    }
  }

  form_series_and_categories(data) {
    var i;

    var categories = [];
    var series = [];

    var strong_buys = [];
    var buys = [];
    var holds = [];
    var sells = [];
    var strong_sells = [];

    for (i=0; i<data.length; i++) {
      categories.push(data[i].period);
      strong_buys.push(data[i].strongBuy);
      buys.push(data[i].buy);
      holds.push(data[i].hold);
      sells.push(data[i].sell);
      strong_sells.push(data[i].strongSell)
    }

    return {
      "categories": categories,
      "series": [{
              "data": strong_buys,
              "name": "Strong Buy",
              "color": "#186f37"
            }, 
            {
              "data": buys,
              "name": "Buy",
              "color": "#1cb955"
            },
            {
              "data": holds,
              "name": "Hold",
              "color": "#ab801c"
            },
            {
              "data": sells,
              "name": "Sell",
              "color": "#f45b5b"
            },
            {
              "data": strong_sells,
              "name": "Strong Sell",
              "color": "#803131"
            }]
    }
  }

  company_recommendation_trends_subscribe_data(data) {
    console.log("RecommendationTrendsComponent company_stock_candles_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    var trends_data = this.form_series_and_categories(data.trends);

    this.chartOptions = {
          title: {
              text: `Recommendation Trends`,
          },
          chart: {
              type: 'column'
          },
      
          plotOptions: {
              series: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true
                  },
              }
          },
          series: trends_data.series,
          xAxis: {
              categories: trends_data.categories,
              scrollbar: {
                enabled: true
            }
          },
      
          yAxis: {
              min: 0,
              title: {
                  text: '#Analysis'
              },
          },
      
      }


  }

  chartCallback = (chart) => {
    console.log("In chartCallBack")
    setTimeout(()=>{
      chart.reflow();
    }, 2000);
  }

}
