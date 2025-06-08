import { Component, inject, OnDestroy } from '@angular/core';
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

  public auth(): void {
    this.authService.removeToken();
    if (!this.authService.getAuthToken()) {
      this.authService.fetchToken()
        .pipe(
          takeUntil(this.sub$)
        ).subscribe({
          next: (response) => {
            console.log('Successfully obtained token:', response);
            this.navigateToMarlet();
          },
          error: (err) => {
            console.error('Token acquisition failed:', err);
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
