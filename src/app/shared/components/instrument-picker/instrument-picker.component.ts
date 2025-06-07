import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Instrument } from '../../../common/models/instrument';
import { InstrumentsPipe } from '../../../common/pipe/instruments.pipe';

@Component({
  selector: 'instrument-picker',
  standalone: true,
  imports: [FormsModule, InstrumentsPipe],
  templateUrl: './instrument-picker.component.html',
  styleUrl: './instrument-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentPickerComponent {
  @Input({ required: true })
  instrumentList!: Instrument[];
  @Output() instumentSelectedId = new EventEmitter<string>();

  searchValue: string = '';

  public onInstumentSelect(id: string): void {
    this.instumentSelectedId.emit(id);
  }

}
