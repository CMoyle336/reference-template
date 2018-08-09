import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './layout/cart.component';
import { SummaryComponent } from './component/summary.component';

import { CartModule as cModule, StoreModule, PricingModule } from '@apttus/ecommerce';
import { CybersourceComponent } from './component/cybersource/cybersource.component';
import { ComponentModule } from '../../components/component.module';
import { CardFormComponent } from './component/card-form/card-form.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    CartRoutingModule,
    cModule,
    StoreModule,
    PricingModule,
    FormsModule,
    ComponentModule,
    NgxPageScrollModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [CartComponent, SummaryComponent, CybersourceComponent, CardFormComponent]
})
export class CartModule { }
