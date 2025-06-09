import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  private authService = inject(AuthService);
  private socketSubject!: WebSocketSubject<any>;
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();

  private readonly WS_URL = environments.WS_URL!;

  public _isConnected = signal<boolean>(false);
  public readonly isConnected = this._isConnected.asReadonly();

  public connect(): Observable<any> {
    const token = this.authService.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available.'));
    }

    this.socketSubject = webSocket({
      url: this.WS_URL,
      openObserver: {
        next: () => {
          this._isConnected.set(true);
          this.socketSubject.next(JSON.stringify({ type: 'authenticate', token: token }));
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
          return JSON.parse(msg.data);
        } catch (e) {
          return msg.data;
        }
      },
      serializer: (value: any) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return value;
        }
      }
    });

    this.socketSubject.pipe(
      catchError(error => {
        this.messagesSubject.error(error);
        this._isConnected.set(false);
        return throwError(() => error);
      }),
    )
      .subscribe({
        next: (msg: any) => this.messagesSubject.next(msg),
        error: (err: any) => {
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

  public sendMessage(id: string): void {
    const message = {
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": id,
      "provider": "simulation",
      "subscribe": true,
      "kinds": [
        "ask",
        "bid",
        "last"
      ]
    }
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