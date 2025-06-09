import { Component, inject, OnInit } from '@angular/core';
import { InstrumentsService } from '../../common/services/instruments.service';
import { RealTimeDataService } from '../../common/services/real-time-data.service';
import { InstrumentPickerComponent } from '../../features/instrument-picker/instrument-picker.component';
import { filter, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Instrument, InstrumentReponce } from '../../common/models/instrument';
import { LiveData, LiveDataRes } from '../../common/models/live.data';
import { LiveDataWrapperComponent } from '../../features/live-data-wrapper/live-data-wrapper.component';
import { StreamingDataComponent } from '../../shared/components/streaming-data/streaming-data.component';
import { CandleChartComponent } from '../../shared/components/candle-chart/candle-chart.component';

@Component({
  selector: 'market-data-page',
  standalone: true,
  templateUrl: './market-data-page.component.html',
  styleUrl: './market-data-page.component.scss',
  imports: [
    AsyncPipe,
    DatePipe,
    InstrumentPickerComponent,
    LiveDataWrapperComponent,
    StreamingDataComponent,
    CandleChartComponent
  ],
})
export class MarketDataPageComponent implements OnInit {
  private instrumentsService = inject(InstrumentsService);
  private realtimeDataService = inject(RealTimeDataService);

  private destroy$ = new Subject<void>();
  public instrumentsList$!: Observable<Instrument[]>;
  public chartData$!: Observable<any>;
  public liveData$!: Observable<LiveData | undefined>;
  public symbol!: string;

  ngOnInit(): void {
    this.getInsruments();
    this.websocketConnect();
  }

  public onInstumentSelect(instrument: Instrument): void {
    this.chartData$ = this.instrumentsService.getItemBarData(instrument.id)
      .pipe(
        map(res => res.data)
      )
    this.realtimeDataService.sendMessage(instrument.id);
    this.symbol = instrument.symbol;

  }

  public onUnsub(): void {
    this.realtimeDataService.disconnect();
  }

  public onSubscribe(): void {

  }


  private getInsruments(): void {
    this.instrumentsList$ = this.instrumentsService.getInstruments()
      .pipe(
        map((res: InstrumentReponce) => {
          return res.data
        })
      );
  }

  private websocketConnect(): void {
    this.liveData$ = this.realtimeDataService.connect()
      .pipe(
        map((message: LiveDataRes) => {
          if (message.ask) {
            return message.ask
          }
          else if (message.bid) {
            return message.bid;
          }
          else {
            return message.last;
          }
        })
      )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
