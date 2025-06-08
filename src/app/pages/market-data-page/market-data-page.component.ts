import { Component, inject, OnInit } from '@angular/core';
import { InstrumentsService } from '../../common/services/instruments.service';
import { RealTimeDataService } from '../../common/services/real-time-data.service';
import { InstrumentPickerComponent } from '../../features/instrument-picker/instrument-picker.component';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Instrument, InstrumentReponce } from '../../common/models/instrument';
import { LiveDataComponent } from '../../shared/components/live-data/live-data.component';
import { HistoricalChartComponent } from '../../shared/components/historical-chart/historical-chart.component';
import { CandlestickChart } from '../../common/models/candlestick.chart';
import { LiveData, LiveDataRes } from '../../common/models/live.data';

@Component({
  selector: 'market-data-page',
  standalone: true,
  imports: [InstrumentPickerComponent, LiveDataComponent, HistoricalChartComponent, AsyncPipe],
  templateUrl: './market-data-page.component.html',
  styleUrl: './market-data-page.component.scss'
})
export class MarketDataPageComponent implements OnInit {
  private instrumentsService = inject(InstrumentsService);
  private realtimeDataService = inject(RealTimeDataService);

  public instrumentsList$!: Observable<Instrument[]>;
  public chartData$!: Observable<CandlestickChart[]>;
  public liveData$!: Observable<LiveData | undefined>;
  public symbol!: string;

  ngOnInit(): void {
    this.getInsruments();
    this.websocketConnect();
  }

  public onInstumentSelect(instrument: Instrument): void {
    // const testSTR = 'ebefe2c7-5ac9-43bb-a8b7-4a97bf2c2576'

    this.chartData$ = this.instrumentsService.getItemBarData(instrument.id);
    this.realtimeDataService.sendMessage(instrument.id);
    this.symbol = instrument.symbol;
  }

  public onUnsub() {
    this.realtimeDataService.disconnect();
  }

  private getInsruments(): void {
    this.instrumentsList$ = this.instrumentsService.getInstruments()
      .pipe(
        map((res: InstrumentReponce) => {
          return res.data
        })
      );
  }

  private websocketConnect() {
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

}
