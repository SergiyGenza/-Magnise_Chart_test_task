import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';
import { OhlcvOutputItem } from '../utils/transform.data';
import { InstrumentReponce } from '../models/instrument';

export interface TradingHours {
  regularStart: string;
  regularEnd: string;
  electronicStart: string;
  electronicEnd: string;
}

export interface MappingDetails {
  symbol: string;
  exchange: string;
  defaultOrderSize: number;
  maxOrderSize?: number;
  tradingHours: TradingHours;
}

export interface Mappings {
  dxfeed: MappingDetails;
  oanda: MappingDetails;
  simulation: MappingDetails;
}

export interface Profile {
  name: string;
  gics: Record<string, never>;
}

export interface AssetData {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: Mappings;
  profile: Profile;
}

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private instrumentsUrl = environments.API_INSTRUMENTS!;
  private barsUrl = environments.API_BARS!;

  public getInstruments(): Observable<InstrumentReponce> {
    const provider: string = 'oanda';
    const kind: string = 'forex'

    let params = new HttpParams();
    params = params.append('provider', provider);
    params = params.append('kind', kind);

    const authToken = this.authService.getAuthToken();
    if (!authToken) {
      return throwError(() => new Error('Authentication token not found. Please log in.'));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      }),
      params: params
    };

    return this.http.get<InstrumentReponce>(this.instrumentsUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public getItemBarData(instrumentId: string): Observable<OhlcvOutputItem> {
    const provider: string = 'simulation';
    const interval: number = 1;
    const periodicity: string = 'minute';
    const barsCount: number = 10;

    let params = new HttpParams();
    params = params.append('instrumentId', instrumentId);
    params = params.append('provider', provider);
    params = params.append('interval', interval.toString());
    params = params.append('periodicity', periodicity);
    params = params.append('barsCount', barsCount.toString());

    const authToken = this.authService.getAuthToken();

    if (!authToken) {
      return throwError(() => new Error('Authentication token not found. Please log in.'));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      }),
      params: params
    };

    return this.http.get<OhlcvOutputItem>(this.barsUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      if (error.status === 401) {
        errorMessage = 'Unauthorized. Please check your token.';
      } else if (error.status === 400) {
        errorMessage = `Bad Request: ${error.error?.message || 'Check your request parameters.'}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}