import { Component, OnInit } from '@angular/core';
import { CompanyInfoService } from 'src/app/services/company_info/company-info.service';
import { CompanyPeersService } from 'src/app/services/company_peers/company-peers.service';

@Component({
  selector: 'app-company-about',
  templateUrl: './company-about.component.html',
  styleUrls: ['./company-about.component.css']
})
export class CompanyAboutComponent implements OnInit {

  company_about_details = {
    "ipo_start_date": "",
    "industry": "",
    "webpage": "",
    "company_peers": []
  };
  constructor(
    public company_info_service: CompanyInfoService,
    public company_peers_service: CompanyPeersService
  ) { }

  ngOnInit(): void {
    this.company_info_service.company_info$.subscribe((data) => {
      this.company_info_subscribe_data(data);
    });

    this.company_peers_service.company_peers$.subscribe((data) => {
      this.company_peers_subscribe_data(data);
    })
  }

  handle_error() {
    this.company_about_details = {
      "ipo_start_date": "",
      "industry": "",
      "webpage": "",
      "company_peers": []
    };
  }

  company_peers_subscribe_data(data) {
    console.log("CompanyAboutComponent company_info_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.company_about_details["company_peers"] = data.peers;
    console.log(this.company_about_details);

  }

  company_info_subscribe_data(data) {
    console.log("CompanyAboutComponent company_info_subscribe_data subscribe data: " + JSON.stringify(data));

    if ("error" in data) {
      console.log("Error in response from service. Not going to do anything.");
      this.handle_error();
      return;
    }

    this.company_about_details["ipo_start_date"] = data.ipo;
    this.company_about_details["industry"] = data.finnhubIndustry;
    this.company_about_details["webpage"] = data.weburl;
  }
}
