import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NftRoutingModule } from './nft-routing.module';

import { NftListComponent } from './components/nft-list/nft-list.component';
import { NftCardComponent } from './components/nft-card/nft-card.component';
import { UserNftsComponent } from './components/user-nfts/user-nfts.component';

@NgModule({
  providers: [],
  declarations: [NftListComponent, NftCardComponent, UserNftsComponent],
  imports: [CommonModule, ReactiveFormsModule, NftRoutingModule, FormsModule],
})
export class NftModule {}
