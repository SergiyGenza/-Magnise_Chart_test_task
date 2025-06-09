import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import { OhlcvOutputItem, transformOhlcvDataReverse } from '../../../common/utils/transform.data';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-candle-chart',
  templateUrl: './candle-chart.component.html',
  imports: [NgApexchartsModule],
  styles: [`
    canvas {
      max-width: 800px;
      max-height: 400px;
      margin: 20px auto;
      display: block;
    }
  `],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandleChartComponent {
  @Input({ required: true })
  data: OhlcvOutputItem[] = []

  public chartOptions!: ChartOptions;

  ngOnInit(): void {
    const transData = transformOhlcvDataReverse(this.data);
    this.createChart(transData);
  }

  createChart(data: any) {
    this.chartOptions = {
      series: [
        {
          name: 'Candlestick',
          data
        }
      ],
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: true
        }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
    };
  }

}
