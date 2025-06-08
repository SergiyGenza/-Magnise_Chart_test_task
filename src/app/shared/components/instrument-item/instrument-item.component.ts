import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Instrument } from '../../../common/models/instrument';

@Component({
  selector: 'instrument-item',
  standalone: true,
  imports: [],
  templateUrl: './instrument-item.component.html',
  styleUrl: './instrument-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentItemComponent {
  @Input({ required: true })
  public instrumentItem!: Instrument;

  @Output()
  selectedInstrument = new EventEmitter<Instrument>();

  public onInstrumentSelect(instrument: Instrument) {
    console.log('works');
    this.selectedInstrument.emit(instrument);
  }
} 
