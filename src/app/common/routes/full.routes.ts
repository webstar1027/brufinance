import { Routes } from '@angular/router';

export const full: Routes = [
  {
    path: '',
    loadChildren: () =>
      // import('../../modules/auth/auth.module').then((m) => m.AuthModule),
      import('../../modules/flow/flow.module').then((m) => m.FlowModule),
  },
];
