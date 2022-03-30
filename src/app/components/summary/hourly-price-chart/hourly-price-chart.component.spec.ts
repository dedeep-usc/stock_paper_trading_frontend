import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyPriceChartComponent } from './hourly-price-chart.component';

describe('HourlyPriceChartComponent', () => {
  let component: HourlyPriceChartComponent;
  let fixture: ComponentFixture<HourlyPriceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourlyPriceChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyPriceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
