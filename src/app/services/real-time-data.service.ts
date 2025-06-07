import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  private authService = inject(AuthService);
  private socketSubject!: WebSocketSubject<any>;
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();

  private readonly WS_URL = environments.WS_URL!;


  public connect(): Observable<any> {
    const token = this.authService.getAuthToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available.'));
    }

    this.socketSubject = webSocket({
      url: this.WS_URL,
      openObserver: {
        next: () => {
          console.log('[WebSocket]: Connection established. Sending authentication token.');
          this.socketSubject.next(JSON.stringify({ type: 'authenticate', token: token }));
        }
      },
      closeObserver: {
        next: (event: CloseEvent) => {
          console.log('[WebSocket]: Connection closed.', event);
          this.messagesSubject.complete();
        }
      },
      deserializer: (msg: MessageEvent) => {
        try {
          return JSON.parse(msg.data);
        } catch (e) {
          console.warn('[WebSocket]: Could not parse incoming message as JSON:', msg.data);
          return msg.data;
        }
      },
      serializer: (value: any) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          console.error('[WebSocket]: Could not serialize outgoing message:', value);
          return value;
        }
      }
    });

    this.socketSubject.pipe(
      catchError(error => {
        console.error('[WebSocket]: Error:', error);
        this.messagesSubject.error(error);
        return throwError(() => error);
      }),
    )
      .subscribe({
        next: (msg: any) => this.messagesSubject.next(msg),
        error: (err: any) => {
          console.error('[WebSocket]: Stream error, closing connection.', err);
          this.messagesSubject.error(err);
        },
        complete: () => {
          console.log('[WebSocket]: Stream completed, closing connection.');
          this.messagesSubject.complete();
        }
      });

    return this.messagesSubject.asObservable();
  }

  public sendMessage(message: any): void {
    if (this.socketSubject && !this.socketSubject.closed) {
      this.socketSubject.next(message);
    } else {
      console.warn('WebSocket is not connected or closed. Message not sent:', message);
    }
  }

  public disconnect(): void {
    if (this.socketSubject && !this.socketSubject.closed) {
      console.log('[WebSocket]: Disconnecting...');
      this.socketSubject.complete();
    }
  }
}