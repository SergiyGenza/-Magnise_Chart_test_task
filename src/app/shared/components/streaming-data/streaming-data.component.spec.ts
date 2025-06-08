import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingDataComponent } from './streaming-data.component';

describe('StreamingDataComponent', () => {
  let component: StreamingDataComponent;
  let fixture: ComponentFixture<StreamingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
