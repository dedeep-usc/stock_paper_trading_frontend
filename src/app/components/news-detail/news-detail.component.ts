import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {

  @Input() public news;
  fbSrc;

  constructor(public newsModalService: NgbActiveModal) {}

  ngOnInit(): void {
    this.fbSrc =
      'https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent(this.news.url) +
      '&amp;src=sdkpreparse';
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

}
