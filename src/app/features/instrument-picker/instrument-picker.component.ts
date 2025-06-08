import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Instrument } from '../../common/models/instrument';
import { InstrumentsPipe } from '../../common/pipe/instruments.pipe';
import { InstrumentItemComponent } from '../../shared/components/instrument-item/instrument-item.component';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToggleOnFocusDirective } from '../../shared/directive/toggle-on-focus.directive';

enum sub {
  Subscribe = "Subscribe",
  Unsubcribe = "Unsubcribe"
}

@Component({
  selector: 'instrument-picker',
  standalone: true,
  imports: [FormsModule, InstrumentsPipe, InstrumentItemComponent, ToggleOnFocusDirective],
  templateUrl: './instrument-picker.component.html',
  styleUrl: './instrument-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentPickerComponent implements OnInit {
  @Input({ required: true })
  public instrumentList!: Instrument[];

  @Output()
  instumentSelectedId = new EventEmitter<Instrument>();
  @Output()
  unsubcribe = new EventEmitter();

  private lastPicedInstrument$ = new BehaviorSubject<Instrument | null>(null);

  // public openList: boolean = true;

  public searchValue: string = '';
  public btnTitle = sub.Subscribe;

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  public onInstumentSelect(instrument: Instrument): void {
    this.lastPicedInstrument$.next(instrument);
    this.instumentSelectedId.emit(instrument);
    this.btnTitleChange(sub.Unsubcribe);
  }

  public onSubsribeBtnToogle(): void {
    this.btnTitleChange(sub.Subscribe);

    if (this.btnTitle === sub.Subscribe) this.unsubcribe.emit();

    if (this.lastPicedInstrument$.value) {
      this.onInstumentSelect(this.lastPicedInstrument$.value)
    }
  }

  private btnTitleChange(title: sub): void {
    this.btnTitle = title;
  }

}
