import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { FooterComponent } from './footer/footer.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockResultsComponent } from './stock-results/stock-results.component'
import { MatTabsModule } from '@angular/material/tabs';
import { PriceSummaryDetailsComponent } from './price-summary-details/price-summary-details.component';
import { CompanyAboutComponent } from './components/summary/company-about/company-about.component';
import { HourlyPriceChartComponent } from './components/summary/hourly-price-chart/hourly-price-chart.component';

import { HighchartsChartModule } from 'highcharts-angular';
import { MainChartComponent } from './components/charts/main-chart/main-chart.component';
import { RecommendationTrendsComponent } from './components/insights/recommendation-trends/recommendation-trends.component';
import { HistoricalEpsComponent } from './components/insights/historical-eps/historical-eps.component';
import { SocialSentimentsComponent } from './components/insights/social-sentiments/social-sentiments.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomePageComponent,
    NavbarComponent,
    PortfolioComponent,
    WatchlistComponent,
    SearchBoxComponent,
    FooterComponent,
    StockResultsComponent,
    PriceSummaryDetailsComponent,
    CompanyAboutComponent,
    HourlyPriceChartComponent,
    MainChartComponent,
    SocialSentimentsComponent,
    RecommendationTrendsComponent,
    HistoricalEpsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
