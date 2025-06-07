import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LiveData } from '../../../common/models/live.data';

@Component({
  selector: 'live-data',
  standalone: true,
  imports: [],
  templateUrl: './live-data.component.html',
  styleUrl: './live-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveDataComponent implements OnChanges {
  @Input({required: true})
  symbol!: string;
  @Input({ required: true })
  liveData!: LiveData;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.liveData);
  }
}