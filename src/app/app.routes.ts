import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'market',
    loadComponent: () => import('../app/pages/market-data-page/market-data-page.component').then((c) => c.MarketDataPageComponent)
  },
  {
    path: '**',
    redirectTo: '/market'
  },
];
