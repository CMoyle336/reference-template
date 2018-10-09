import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SlickModule } from 'ngx-slick';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule }   from '@angular/forms';
import { NavAccountComponent } from './nav-account/nav-account.component';
import { SalesforceModule } from 'ng-salesforce';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { StoreModule, CartModule, PricingModule } from '@apttus/ecommerce';
import { OutputFieldComponent } from './output-field/output-field.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ItemConfigurationSummaryComponent } from './item-configuration-summary/item-configuration-summary.component';
import { PriceComponent } from './price-component/price-component.component';
import { MyMiniProfileComponent } from './my-mini-profile/my-mini-profile.component';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    SlickModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    LaddaModule,
    RouterModule,
    FormsModule,
    SalesforceModule,
    StoreModule,
    CartModule,
    PricingModule
  ],
  exports : [
    HeaderComponent,
    LazyLoadImageModule,
    LaddaModule,
    FooterComponent,
    OutputFieldComponent,
    ItemConfigurationSummaryComponent,
    PriceComponent
  ],
  declarations: [
    HeaderComponent,
    NavAccountComponent,
    FooterComponent,
    OutputFieldComponent,
    ItemConfigurationSummaryComponent,
    PriceComponent,
    MyMiniProfileComponent
  ]
})
export class ComponentModule { }
