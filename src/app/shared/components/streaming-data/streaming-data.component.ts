import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'streaming-data',
  standalone: true,
  imports: [],
  templateUrl: './streaming-data.component.html',
  styleUrl: './streaming-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamingDataComponent {
  @Input({ required: true })
  stream!: unknown;
}
