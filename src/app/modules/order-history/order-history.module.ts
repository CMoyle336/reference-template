import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { OrderHistoryLayoutComponent } from './layout/order-history-layout.component';

@NgModule({
  imports: [
    CommonModule,
    OrderHistoryRoutingModule
  ],
  declarations: [OrderHistoryLayoutComponent]
})
export class OrderHistoryModule { }
