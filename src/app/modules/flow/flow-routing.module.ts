import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowComponent } from './components/borrow/borrow.component';
import { ConnectComponent } from './components/connect/connect.component';
import { HomeComponent } from './components/home/home.component';
import { LendingPoolsComponent } from './components/lendingPools/lendingPools.component';
import { MytransactionsComponent } from './components/mytransactions/mytransactions.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'connect',
    component: ConnectComponent,
  },
  {
    path: 'lending',
    component: LendingPoolsComponent,
  },
  {
    path: 'borrow',
    component: BorrowComponent,
  },
  {
    path: 'my-transactions',
    component: MytransactionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowRoutingModule { }
