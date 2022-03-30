import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSummaryDetailsComponent } from './price-summary-details.component';

describe('PriceSummaryDetailsComponent', () => {
  let component: PriceSummaryDetailsComponent;
  let fixture: ComponentFixture<PriceSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceSummaryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
