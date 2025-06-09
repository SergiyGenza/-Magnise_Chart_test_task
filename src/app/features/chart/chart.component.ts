import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  signal,
  effect
} from '@angular/core';
import {
  createChart,
  IChartApi,
  Time,
  CandlestickSeriesPartialOptions,
  DeepPartial,
  HistogramSeriesPartialOptions,
  ChartOptions,
  ColorType
} from 'lightweight-charts';

export interface OhlcData {
  t: string; // Time (ISO string)
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
}

interface CandlestickDataPoint {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeDataPoint {
  time: Time;
  value: number;
  color?: string;
}

export interface OhlcData {
  t: string; // Time (ISO string)
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
}

// Інтерфейс для даних Lightweight Charts
interface CandlestickDataPoint {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeDataPoint {
  time: Time;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  @Input()
  data: OhlcData[] = [];

  @Input()
  chartOptions: DeepPartial<ChartOptions> = {
    layout: {
      textColor: '#d1d4dc',
      background: { type: ColorType.Solid, color: '#1d212b' },
    },
    timeScale: {
      timeVisible: true,
    },
  };

  @Input()
  candlestickSeriesOptions: DeepPartial<CandlestickSeriesPartialOptions> = {}; // Пустий об'єкт
  // candlestickSeriesOptions: DeepPartial<CandlestickSeriesPartialOptions> = {
  //   upColor: '#26a69a',
  //   downColor: '#ef5350',
  //   borderVisible: false,
  //   wickUpColor: '#26a69a',
  //   wickDownColor: '#ef5350',
  // };

  @Input()
  volumeSeriesOptions: DeepPartial<HistogramSeriesPartialOptions> = {
    // base:/
    // overlay: true, // Це важливо для відображення об'єму на тому ж масштабі
  };
  // volumeSeriesOptions: any = {
  //   color: '#26a69a',
  //   priceFormat: {
  //     type: 'volume',
  //   },
  //   overlay: true,
  //   scaleMargins: {
  //     top: 0.8,
  //     bottom: 0,
  //   },
  // };

  private chart: IChartApi | null = null;
  private candlestickSeries: any = null;
  private volumeSeries: any = null;

  constructor() {
    // Ефект, якщо `data` є Angular Signal та може змінюватися динамічно
    // effect(() => {
    //   // Якщо `data` є signal(), потрібно отримувати його значення: this.data()
    //   if (this.chart && this.data.length > 0) {
    //     this.updateChartData(this.data);
    //   }
    // });
  }

  ngOnInit(): void {
    console.log(this.data);

  }

  ngAfterViewInit(): void {
    this.createChartOnly();
    window.addEventListener('resize', this.onResize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue !== changes['data'].previousValue) {
      console.log('Chart data received/changed:', changes['data'].currentValue); // ДОДАЙТЕ ЦЕ
      if (this.chart && this.candlestickSeries && this.volumeSeries) {
        this.updateChartData(changes['data'].currentValue);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.remove();
    }
    window.removeEventListener('resize', this.onResize);
  }

  private createChartOnly(): void {
    console.log('works createChartOnly');

    if (!this.chartContainer) {
      console.error('Chart container element not found!');
      return;
    }
    this.chart = createChart(this.chartContainer.nativeElement, this.chartOptions);
    this.candlestickSeries = this.chart.addCandlestickSeries(this.candlestickSeriesOptions);
    this.volumeSeries = this.chart.addHistogramSeries(this.volumeSeriesOptions);
    
    if (this.data && this.data.length > 0) {
      console.log('in if', this.data );
      this.updateChartData(this.data);
    }
  }

  private updateChartData(ohlcData: OhlcData[]): void {
    console.log('ohlcData', ohlcData);

    if (!ohlcData || !Array.isArray(ohlcData) || ohlcData.length === 0) {
      console.warn('No data to display or data is not an array.');
      if (this.candlestickSeries) {
        this.candlestickSeries.setData([]);
      }
      if (this.volumeSeries) {
        this.volumeSeries.setData([]);
      }
      return;
    }

    console.log('Updating chart with:', ohlcData.length, 'data points'); // ДОДАЙТЕ ЦЕ

    const formattedCandles: CandlestickDataPoint[] = ohlcData.map(d => ({
      time: this.parseTime(d.t),
      open: d.o,
      high: d.h,
      low: d.l,
      close: d.c,
    }));

    const formattedVolumes: VolumeDataPoint[] = ohlcData.map((d, index, arr) => {
      const prevClose = index > 0 ? arr[index - 1].c : d.o;
      const color = d.c >= prevClose ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)';

      return {
        time: this.parseTime(d.t),
        value: d.v,
        color: color,
      };
    });

    this.candlestickSeries.setData(formattedCandles);
    this.volumeSeries.setData(formattedVolumes);

    this.chart?.timeScale().fitContent();
  }

  private parseTime(isoString: string): Time {
    return Math.floor(new Date(isoString).getTime() / 1000) as Time;
  }

  private onResize = () => {
    if (this.chart && this.chartContainer) {
      const { width, height } = this.chartContainer.nativeElement.getBoundingClientRect();
      this.chart.resize(width, height);
    }
  };
}
