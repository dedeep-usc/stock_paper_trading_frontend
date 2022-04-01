import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  ticker_val = "home";

  ngOnInit(): void {
  }

  highlight_search() {
    if( this.ticker_val == "HOME") {
      return {
        "show-border": false,
        "navbar-item": true
      };
    }

    return {
      "show-border": true,
      "navbar-item": true
    }
  }

}
