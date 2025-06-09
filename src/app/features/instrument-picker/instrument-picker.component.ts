import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Instrument } from '../../common/models/instrument';
import { InstrumentsPipe } from '../../common/pipe/instruments.pipe';
import { InstrumentItemComponent } from '../../shared/components/instrument-item/instrument-item.component';
import { BehaviorSubject } from 'rxjs';
import { ToggleOnFocusDirective } from '../../shared/directive/toggle-on-focus.directive';
import { CommonModule } from '@angular/common';

enum ButtonAction {
  Subscribe = "Subscribe",
  Unsubscribe = "Unsubscribe"
}

@Component({
  selector: 'instrument-picker',
  standalone: true,
  imports: [FormsModule, InstrumentsPipe, InstrumentItemComponent, ToggleOnFocusDirective, CommonModule],
  templateUrl: './instrument-picker.component.html',
  styleUrl: './instrument-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentPickerComponent implements OnChanges {
  @Input({ required: true })
  public instrumentList!: Instrument[];

  @Output()
  instumentSelectedId = new EventEmitter<Instrument>();
  @Output()
  subscribe = new EventEmitter<void>();
  @Output()
  unsubscribe = new EventEmitter<void>();

  public searchValue: string;
  public btnTitle: ButtonAction = ButtonAction.Subscribe;

  private lastPickedInstrument$ = new BehaviorSubject<Instrument | null>(null);

  constructor() {
    this.searchValue = this.lastPickedInstrument$.value?.description || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instrumentList'] && this.instrumentList.length === 0) {
      this.lastPickedInstrument$.next(null);
      this.searchValue = '';
    }
  }

  public onInstrumentSelect(instrument: Instrument): void {
    console.log(instrument.symbol);
    this.btnTitle = ButtonAction.Subscribe;
    this.lastPickedInstrument$.next(instrument);
    this.searchValue = this.lastPickedInstrument$.value!.symbol;
  }

  public toggleSubscription(): void {
    if (this.lastPickedInstrument$.value && this.btnTitle === ButtonAction.Unsubscribe) {
      this.unsubscribe.emit();
      this.btnTitle = ButtonAction.Subscribe;
    }
    else if (this.lastPickedInstrument$.value && this.btnTitle === ButtonAction.Subscribe) {
      this.subscribe.emit();
      this.instumentSelectedId.emit(this.lastPickedInstrument$.value);
      this.btnTitle = ButtonAction.Unsubscribe;
    }
  }
}