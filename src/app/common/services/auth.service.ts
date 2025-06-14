import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environments } from '../../../environments/environments';

interface AuthResponse {
  access_token?: string;
  token?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenUrl = environments.API_KEY!;
  private readonly TOKEN_KEY = 'authToken';

  private readonly _isAuthenticatedSignal = signal<boolean>(false);

  public readonly isAuthenticated = this._isAuthenticatedSignal.asReadonly();

  private http = inject(HttpClient);

  constructor() {
    this.checkTokenOnAppInit();
  }

  public checkTokenOnAppInit(): void {
    if (this.getAuthToken()) {
      this._isAuthenticatedSignal.set(true);
      console.log('all is good');
    } else {
      this.fetchToken().subscribe({
        next: () => console.log('refetch Token successful'),
        error: (err) => console.error('refetch Token failed:', err)
      });
      console.log('refetch Token initiated');
    }
  }

  public fetchToken() {
    const payload = {
      username: environments.USERNAME,
      password: environments.PASSWORD,
    };

    return this.http.post<AuthResponse>(this.tokenUrl, payload).pipe(
      tap((response: AuthResponse) => {
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
        this._isAuthenticatedSignal.set(true);
      }),
      catchError(this.handleError)
    );
  }

  public getAuthToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  private saveAuthToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this._isAuthenticatedSignal.set(true);
  }

  public removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this._isAuthenticatedSignal.set(false);
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
    this._isAuthenticatedSignal.set(false);
    return throwError(() => new Error(errorMessage));
  }
}