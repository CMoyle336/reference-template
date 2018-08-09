import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentModule } from '../../components/component.module';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './layout/product-list.component';
import { SubcategoryComponent } from './component/subcategory.component';
import { BreadcrumbComponent } from './component/breadcrumb.component';
import { PriceTierComponent } from './component/price-tier.component';

import { CatalogModule, StoreModule, PricingModule } from '@apttus/ecommerce';
import { RelatedCategoryComponent } from './component/related-category.component';
import { FieldFilterComponent } from './component/field-filter.component';
import { ResultsComponent } from './component/results.component';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    CommonModule,
    ProductListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentModule,
    StoreModule,
    PricingModule,
    CatalogModule,
    NgxPageScrollModule,
    PaginationModule.forRoot()
  ],
  declarations: [ProductListComponent, SubcategoryComponent, BreadcrumbComponent, PriceTierComponent, RelatedCategoryComponent, FieldFilterComponent, ResultsComponent]
})
export class ProductListModule { }
