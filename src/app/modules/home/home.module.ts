import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './layout/home.component';
import { ComponentModule } from '../../components/component.module';
import { CatalogModule, StoreModule } from '@apttus/ecommerce';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentModule,
    CatalogModule,
    StoreModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
