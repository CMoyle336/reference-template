import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureLayoutComponent } from './layout/configure-layout.component';
import { CartModule, CatalogModule, PricingModule, StoreModule, CommerceModule } from '@apttus/ecommerce';
import { SalesforceModule } from 'ng-salesforce';
import { OptionAccordionComponent } from './component/option-accordion/option-accordion.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AttributeAccordionComponent } from './component/attribute-accordion/attribute-accordion.component';
import { SummaryComponent } from './component/summary/summary.component';
import { RecommendationsComponent } from './component/recommendations/recommendations.component';

import { ComponentModule } from '../../components/component.module';
import { SlickModule } from 'ngx-slick';

@NgModule({
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    FormsModule,
    CatalogModule,
    PricingModule,
    CartModule,
    StoreModule,
    SalesforceModule,
    CommerceModule,
    ComponentModule,
    SlickModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ConfigureLayoutComponent, OptionAccordionComponent, AttributeAccordionComponent, SummaryComponent, RecommendationsComponent]
})
export class ConfigureModule { }
