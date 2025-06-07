import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { InstrumentsService } from './services/instruments.service';
import { RealTimeDataService } from './services/real-time-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Fintacharts_Market_Task';

  authService = inject(AuthService);
  instruments = inject(InstrumentsService);
  realtimeDataService = inject(RealTimeDataService);

  realtimeMessages: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // this.getToken();

    // this.getInsrument();

    // this.getItemBar();

    // this.websocket();
  }

  getToken() {
    this.authService.fetchToken().subscribe({
      next: (response) => {
        console.log('Successfully obtained token:', response);
      },
      error: (err) => {
        console.error('Token acquisition failed:', err);
      }
    })
  }

  getInsrument() {
    this.instruments.getInstruments().subscribe(
      s => console.log(s)
    )
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


