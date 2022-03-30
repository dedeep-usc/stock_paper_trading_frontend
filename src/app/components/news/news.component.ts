import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyLatestNewsService } from 'src/app/services/company-latest-news/company-latest-news.service';
import { NewsDetailComponent } from '../news-detail/news-detail.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  title = 'appBootstrap';
  test = "mymodal";
  
  news_data = {
    "news": []
  }

  closeResult: string;

  constructor(
    public newsModalService: NgbModal,
    public company_latest_news_service: CompanyLatestNewsService
    ) { }

  ngOnInit(): void {
    this.company_latest_news_service.company_latest_news$.subscribe((data) => {
      this.company_latest_news_subscribe_data(data);
    });
  }

  open(content) {
    this.newsModalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_news_detail(news) {
    const news_modal_ref = this.newsModalService.open(NewsDetailComponent);
    news_modal_ref.componentInstance.news = news;
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  filter_news(data) {
    var i;
    var filtered_news = [];
    var cur_count = 0;

    for (i=0; i<data.length; i++) {
      if (data[i]["url"] == "" || data[i]["url"] == null || data[i]["source"] == null || data[i]["datetime"] == null || data[i]["headline"] == null || data[i]["summary"] == null ||
      data[i]["source"] == "" || data[i]["datetime"] == "" || data[i]["headline"] == "" || data[i]["summary"] == "" || data[i]["image"] == "" || data[i]["image"] == null) {
        console.log("Skipping");
        continue;
      }

      if (cur_count >= 20) {
        break;
      }

      filtered_news.push(data[i]);

      cur_count += 1;
    }

    return filtered_news;
  }

  company_latest_news_subscribe_data(data) {
    console.log("NewsComponent company_stock_candles_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("NewsComponent Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.news_data = {
      "news": this.filter_news(data.latest_news)
    }

    // console.log("NewsComponent: " + JSON.stringify(this.news_data));
  }

  handle_error() {
    this.news_data = {
      "news": []
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
