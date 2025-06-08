import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenUrl = environments.API_KEY!;
  private readonly TOKEN_KEY = 'authToken';

  public readonly _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private http = inject(HttpClient);

  constructor() {
    this.checkTokenOnAppInit();
  }

  public checkTokenOnAppInit(): void {
    if (this.getAuthToken()) {
      this._isAuthenticated.next(true);
      console.log('all is good');

    } else {
      this.fetchToken()
      console.log('refetch Token');
    }
  }

  public fetchToken() {
    const payload = {
      username: environments.USERNAME,
      password: environments.PASSWORD,
    };

    return this.http.post<any>(this.tokenUrl, payload).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          this.saveAuthToken(response.access_token);
          console.log('get Token');
        } else if (response && response.token) {
          this.saveAuthToken(response.token);
          console.log('get Token');

        } else {
          console.warn('Token not found in response:', response);
          throw new Error('Authentication token not found in response.');
        }
        this._isAuthenticated.next(true);
      }),
      catchError(this.handleError)
    );
  }

  public getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Invalid credentials.';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}