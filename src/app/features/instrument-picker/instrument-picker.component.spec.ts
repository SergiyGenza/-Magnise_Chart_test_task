import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentPickerComponent } from './instrument-picker.component';

describe('InstrumentPickerComponent', () => {
  let component: InstrumentPickerComponent;
  let fixture: ComponentFixture<InstrumentPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
