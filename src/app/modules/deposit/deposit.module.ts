import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DepositRoutingModule } from './deposit-routing.module';
import { LendingComponent } from './components/lending/lending.component';

@NgModule({
  declarations: [LendingComponent],
  imports: [CommonModule, FormsModule, DepositRoutingModule],
})
export class DepositModule {}
