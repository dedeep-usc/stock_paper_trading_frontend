import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockResultsComponent } from './stock-results.component';

describe('StockResultsComponent', () => {
  let component: StockResultsComponent;
  let fixture: ComponentFixture<StockResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
