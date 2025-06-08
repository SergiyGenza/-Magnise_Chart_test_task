import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CandlestickChart } from '../../../common/models/candlestick.chart';

@Component({
  selector: 'historical-chart',
  standalone: true,
  imports: [],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoricalChartComponent implements OnChanges {
  @Input({ required: true })
  chartData!: CandlestickChart[];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.chartData);
  }
}
