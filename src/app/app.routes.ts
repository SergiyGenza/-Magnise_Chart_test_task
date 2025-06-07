import { Routes } from '@angular/router';
import { authGuard } from './common/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'market',
    canActivate: [authGuard],
    loadComponent: () => import('../app/pages/market-data-page/market-data-page.component').then((c) => c.MarketDataPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('../app/pages/login/login.component').then((c) => c.LoginComponent)
  },
  {
    path: '**',
    redirectTo: '/market'
  },
];
