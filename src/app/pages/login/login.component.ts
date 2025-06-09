import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../common/services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);

  private sub$ = new Subject<void>();
  public errorMessage = signal<string | null>(null);

  public auth(): void {
    this.errorMessage.set(null);
    
    this.authService.removeToken();
    if (!this.authService.getAuthToken()) {
      this.authService.fetchToken()
        .pipe(
          takeUntil(this.sub$)
        ).subscribe({
          next: (response) => {
            console.log('Successfully obtained token:', response);
            setTimeout(() => this.navigateToMarlet(), 1000);
          },
          error: (err) => {
            this.errorMessage.set(err.message || 'An unknown error occurred during login.');
          }
        });

      return
    }

    this.navigateToMarlet();
  }

  private navigateToMarlet(): void {
    this.router.navigate(['market']);
  }

  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
