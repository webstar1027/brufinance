import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NftListComponent } from './components/nft-list/nft-list.component';
import { UserNftsComponent } from './components/user-nfts/user-nfts.component';

const routes: Routes = [
  {
    path: 'all',
    component: NftListComponent,
  },
  {
    path: 'my',
    component: UserNftsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftRoutingModule {}
