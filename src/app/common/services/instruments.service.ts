import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private instrumentsUrl = environments.API_INSTRUMENTS!;
  private barsUrl = environments.API_BARS!;

  public getInstruments(provider: string = 'oanda', kind: string = 'forex', symbol?: string, page?: number, size?: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('provider', provider);
    params = params.append('kind', kind);

    if (symbol) {
      params = params.append('symbol', symbol);
    }
    if (page) {
      params = params.append('page', page.toString());
    }
    if (size) {
      params = params.append('size', size.toString());
    }

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

    return this.http.get<any>(this.instrumentsUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public getItemBarData(instrumentId: string, provider: string = 'simulation', interval: number = 1, periodicity: string = 'minute', barsCount: number = 10): Observable<any> {
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

    return this.http.get<any>(this.barsUrl, httpOptions).pipe(
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