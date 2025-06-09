import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'live-data-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './live-data-wrapper.component.html',
  styleUrl: './live-data-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveDataWrapperComponent {
  @Input({ required: true })
  symbol!: string;
}
