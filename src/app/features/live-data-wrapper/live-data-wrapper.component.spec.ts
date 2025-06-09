import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDataWrapperComponent } from './live-data-wrapper.component';

describe('LiveDataWrapperComponent', () => {
  let component: LiveDataWrapperComponent;
  let fixture: ComponentFixture<LiveDataWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveDataWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveDataWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
