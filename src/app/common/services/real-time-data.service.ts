import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { environments } from '../../../environments/environments';

export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

export interface AuthenticateMessage extends WebSocketMessage {
  type: 'authenticate';
  token: string;
}

export interface L1SubscriptionMessage extends WebSocketMessage {
  type: 'l1-subscription';
  id: string;
  instrumentId: string;
  provider: string;
  subscribe: boolean;
  kinds: ('ask' | 'bid' | 'last')[];
}

export interface L1PriceData {
  timestamp: string;
  price: number;
  volume: number;
}

export interface L1UpdateMessage extends WebSocketMessage {
  type: 'l1-update';
  instrumentId: string;
  provider: string;
  ask?: L1PriceData;
  bid?: L1PriceData;
  last?: L1PriceData;
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  private authService = inject(AuthService);
  private socketSubject!: WebSocketSubject<WebSocketMessage>;
  private messagesSubject = new Subject<WebSocketMessage>();
  public messages$: Observable<WebSocketMessage> = this.messagesSubject.asObservable();

  private readonly WS_URL = environments.WS_URL!;

  public _isConnected = signal<boolean>(false);
  public readonly isConnected = this._isConnected.asReadonly();

  public connect(): Observable<WebSocketMessage> {
    const token = this.authService.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available.'));
    }

    this.socketSubject = webSocket<WebSocketMessage>({
      url: this.WS_URL,
      openObserver: {
        next: () => {
          this._isConnected.set(true);
          const authMessage: AuthenticateMessage = { type: 'authenticate', token: token };
          this.socketSubject.next(authMessage);
        }
      },
      closeObserver: {
        next: (event: CloseEvent) => {
          this._isConnected.set(false);
          this.messagesSubject.complete();
        }
      },
      deserializer: (msg: MessageEvent) => {
        try {
          return JSON.parse(msg.data) as WebSocketMessage;
        } catch (e) {
          console.error('WebSocket deserialization error:', e, 'Data:', msg.data);
          return { type: 'unknown', originalData: msg.data };
        }
      },
      serializer: (value: WebSocketMessage) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          console.error('WebSocket serialization error:', e, 'Value:', value);
          throw new Error('Failed to serialize WebSocket message.');
        }
      }
    });

    this.socketSubject.pipe(
      catchError((error: unknown) => {
        this.messagesSubject.error(error);
        this._isConnected.set(false);
        return throwError(() => error);
      }),
    )
      .subscribe({
        next: (msg: WebSocketMessage) => this.messagesSubject.next(msg),
        error: (err: unknown) => {
          this.messagesSubject.error(err);
          this._isConnected.set(false);
        },
        complete: () => {
          this.messagesSubject.complete();
          this._isConnected.set(false);
        }
      });

    return this.messagesSubject.asObservable();
  }

  public sendMessage(id: string, sub: boolean = true): void {
    console.log(sub);

    const message: L1SubscriptionMessage = {
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": id,
      "provider": "simulation",
      "subscribe": sub,
      "kinds": [
        "ask",
        "bid",
        "last"
      ]
    };
    if (this.socketSubject && !this.socketSubject.closed) {
      this.socketSubject.next(message);
    } else {
    }
  }

  public disconnect(): void {
    if (this.socketSubject && !this.socketSubject.closed) {
      this.socketSubject.complete();
    }
    this._isConnected.set(false);
  }
}