import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '../../components/component.module';
import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './layout/product-details.component';

import { ProductImagesComponent } from './component/product-images.component';
import { NgxGalleryModule } from 'ngx-gallery';

import { CartModule, CatalogModule, PricingModule, StoreModule } from '@apttus/ecommerce';
import { SalesforceModule } from 'ng-salesforce';
import { BreadcrumbComponent } from './component/breadcrumb.component';
import { TabFeaturesComponent } from './component/tab-features.component';

import { TabsModule } from 'ngx-bootstrap';
import { ProductReplacementsComponent } from './component/product-replacements.component';

@NgModule({
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    NgxGalleryModule,
    ComponentModule,
    CartModule,
    CatalogModule,
    PricingModule,
    StoreModule,
    SalesforceModule,
    TabsModule.forRoot()
  ],
  providers : [],
  declarations: [ProductDetailsComponent,
                ProductImagesComponent,
                BreadcrumbComponent,
                TabFeaturesComponent,
                ProductReplacementsComponent]
})
export class ProductDetailsModule { }
