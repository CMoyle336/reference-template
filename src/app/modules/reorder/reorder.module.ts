import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReorderRoutingModule } from './reorder-routing.module';
import { ReorderLayoutComponent } from './layout/reorder-layout.component';
import { StoreModule, PricingModule, CommerceModule } from '@apttus/ecommerce';
import { FormWizardModule } from 'angular2-wizard';
import { SelectItemsComponent } from './component/select-items/select-items.component';
import { PaymentComponent } from './component/payment/payment.component';
import { ReviewComponent } from './component/review/review.component';
import { CompleteComponent } from './component/complete/complete.component';
import { CategoryPriceComponent } from './component/category-price/category-price.component';
import { ComponentModule } from '../../components/component.module';

@NgModule({
  imports: [
    CommonModule,
    ReorderRoutingModule,
    StoreModule,
    PricingModule,
    CommerceModule,
    FormWizardModule,
    ComponentModule
  ],
  declarations: [ReorderLayoutComponent, SelectItemsComponent, PaymentComponent, ReviewComponent, CompleteComponent, CategoryPriceComponent]
})
export class ReorderModule { }
