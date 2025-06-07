import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../common/services/auth.service';
import { InstrumentsService } from '../../common/services/instruments.service';
import { RealTimeDataService } from '../../common/services/real-time-data.service';
import { InstrumentPickerComponent } from '../../shared/components/instrument-picker/instrument-picker.component';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Instrument, InstrumentReponce } from '../../common/models/instrument';

@Component({
  selector: 'market-data-page',
  standalone: true,
  imports: [InstrumentPickerComponent, AsyncPipe],
  templateUrl: './market-data-page.component.html',
  styleUrl: './market-data-page.component.scss'
})
export class MarketDataPageComponent implements OnInit {

  private authService = inject(AuthService);
  private instruments = inject(InstrumentsService);
  private realtimeDataService = inject(RealTimeDataService);

  public instrumentsList$!: Observable<Instrument[]>;

  realtimeMessages: any[] = [];

  ngOnInit(): void {
    this.instrumentsList$ = this.getInsruments()
      .pipe(
        map((res: InstrumentReponce) => {
          return res.data
        })
      );
      
    // this.getInsruments()
  }

  public onInstumentSelect(id: string) {
    const testSTR = 'ebefe2c7-5ac9-43bb-a8b7-4a97bf2c2576'
    this.instruments.getItemBar(id).subscribe(
      s => console.log(s)
    )
  }

  public getInsruments() {
    return this.instruments.getInstruments()
    // .subscribe(
    //   s => console.log(s)
    // )
  }

  getItemBar() {
    this.instruments.getItemBar(
      'ebefe2c7-5ac9-43bb-a8b7-4a97bf2c2576',
    ).subscribe(
      s => console.log(s)
    )
  }

  websocket() {
    this.realtimeDataService.connect().subscribe({
      next: (message) => {
        console.log('Received realtime message in component:', message);
        this.realtimeMessages.push(message);
      },
      error: (err) => {
        console.error('Realtime data error in component:', err);
      },
      complete: () => {
        console.log('Realtime data stream completed.');
      }
    });
  }

  sendMessage() {
    const message = {
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": "ebefe2c7-5ac9-43bb-a8b7-4a97bf2c2576",
      "provider": "simulation",
      "subscribe": true,
      "kinds": [
        "ask",
        "bid",
        "last"
      ]
    }
    this.realtimeDataService.sendMessage(message);
  }
}
