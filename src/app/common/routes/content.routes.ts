import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

export const content: Routes = [
  {
    path: 'nfts',
    // canLoad: [AuthGuard],
    loadChildren: () =>
      import('../../modules/nft/nft.module').then((m) => m.NftModule),
  },
  {
    path: 'deposits',
    // canLoad: [AuthGuard],
    loadChildren: () =>
      import('../../modules/deposit/deposit.module').then(
        (m) => m.DepositModule
      ),
  },
  {
    path: 'home',
    // canLoad: [AuthGuard],
    loadChildren: () =>
      import('../../modules/flow/flow.module').then(
        (m) => m.FlowModule
      ),
  },
];
