import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReorderRoutingModule } from './reorder-routing.module';
import { ReorderLayoutComponent } from './layout/reorder-layout.component';
import { StoreModule, PricingModule, CommerceModule } from '@apttus/ecommerce';
import { FormWizardModule } from 'angular2-wizard';
import { SelectItemsComponent } from './component/select-items/select-items.component';
import { PaymentComponent } from './component/payment/payment.component';
import { CardFormComponent } from '../cart/component/card-form/card-form.component';
import { ReviewComponent } from './component/review/review.component';

@NgModule({
  imports: [
    CommonModule,
    ReorderRoutingModule,
    StoreModule,
    PricingModule,
    CommerceModule,
    FormWizardModule
  ],
  declarations: [ReorderLayoutComponent, SelectItemsComponent, PaymentComponent, CardFormComponent, ReviewComponent]
})
export class ReorderModule { }
