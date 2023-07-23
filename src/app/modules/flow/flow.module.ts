import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { LendingComponent } from '../deposit/components/lending/lending.component';
import { ConnectComponent } from './components/connect/connect.component';
import { FlowRoutingModule } from './flow-routing.module';
import { LendingPoolsComponent } from './components/lendingPools/lendingPools.component';
import { BorrowComponent } from './components/borrow/borrow.component';
import { NftCardComponent } from './components/nft-card/nft-card.component';
import { NumberWithCommaPipe } from 'src/app/common/pipes/number-with-comma.pipe';
import { MytransactionsComponent } from './components/mytransactions/mytransactions.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    HomeComponent,
    ConnectComponent,
    LendingPoolsComponent,
    BorrowComponent,
    NftCardComponent,
    NumberWithCommaPipe,
    MytransactionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlowRoutingModule,
    ChartsModule
  ]
})
export class FlowModule { }
