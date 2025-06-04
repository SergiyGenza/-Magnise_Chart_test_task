import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDataPageComponent } from './market-data-page.component';

describe('MarketDataPageComponent', () => {
  let component: MarketDataPageComponent;
  let fixture: ComponentFixture<MarketDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketDataPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
