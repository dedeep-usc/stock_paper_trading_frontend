import { Component, OnInit } from '@angular/core';
import { CompanySocialSentimentService } from 'src/app/services/company-social-sentiment/company-social-sentiment.service';
import { CompanyInfoService } from 'src/app/services/company_info/company-info.service';

@Component({
  selector: 'app-social-sentiments',
  templateUrl: './social-sentiments.component.html',
  styleUrls: ['./social-sentiments.component.css']
})
export class SocialSentimentsComponent implements OnInit {

  company_sentiment_details = {
    "symbol": "",
    "reddit_total_mentions": 0,
    "reddit_positive_mentions": 0,
    "reddit_negative_mentions": 0,
    "twitter_total_mentions": 0,
    "twitter_positive_mentions": 0,
    "twitter_negative_mentions": 0
  }

  constructor(
    public company_social_sentiment_service: CompanySocialSentimentService,
    public company_info_service: CompanyInfoService,
  ) { }

  ngOnInit(): void {
    this.company_social_sentiment_service.company_social_sentiment$.subscribe((data) => {
      this.company_social_sentiment_subscribe_data(data);
    });

    this.company_info_service.company_info$.subscribe((data) => {
      this.company_info_subscribe_data(data);
    });
  }

  handle_error() {
    this.company_sentiment_details = {
      "symbol": "",
      "reddit_total_mentions": 0,
      "reddit_positive_mentions": 0,
      "reddit_negative_mentions": 0,
      "twitter_total_mentions": 0,
      "twitter_positive_mentions": 0,
      "twitter_negative_mentions": 0
    };
  }

  get_data_summary(data) {
    var total_mention = 0;
    var positive_mention = 0;
    var negative_mention = 0;

    var i;

    for (i=0; i<data.length; i++) {
      total_mention += data[i].mention;
      positive_mention += data[i].negativeMention;
      negative_mention += data[i].positiveMention;
    }

    return  {
      "total_mention": total_mention,
      "positive_mention": positive_mention,
      "negative_mention": negative_mention
    }
  }

  company_info_subscribe_data(data) {
    console.log("SocialSentimentsComponent company_info_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.company_sentiment_details["symbol"] = data.name;
  }
 
  company_social_sentiment_subscribe_data(data) {
    console.log("SocialSentimentsComponent company_social_sentiment_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    var reddit_data = this.get_data_summary(data.reddit);
    var twitter_data = this.get_data_summary(data.twitter);
    console.log("SocialSentimentsComponent reddit_data: " + JSON.stringify(reddit_data));
    console.log("SocialSentimentsComponent twitter_data: " + JSON.stringify(twitter_data));

    this.company_sentiment_details = {
      "symbol": this.company_sentiment_details.symbol,
      "reddit_total_mentions": reddit_data.total_mention,
      "reddit_positive_mentions": reddit_data.positive_mention,
      "reddit_negative_mentions": reddit_data.negative_mention,
      "twitter_total_mentions": twitter_data.total_mention,
      "twitter_positive_mentions": twitter_data.positive_mention,
      "twitter_negative_mentions": twitter_data.negative_mention
    };

  }

}
