import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { SalesforceModule } from 'ng-salesforce';
import { CommerceModule } from '@apttus/ecommerce';
import { Configuration } from './salesforce.config';
import { ComponentModule } from './components/component.module';
import { RouteGuard } from './services/route.guard';
import { AuthGuard } from './services/auth.guard';
import { ConfigureGuard } from './services/configure.guard';

import { ForceService } from './services/force.service';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';

// Service Worker
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(localeMx, 'es-MX', localeMxExtra);
export function _window(): any {
  // return the global native browser window object
  return window;
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SalesforceModule.forRoot(
      Configuration
    ),
    CommerceModule.forRoot('tr'),
    ComponentModule
  ],
  providers: [RouteGuard, AuthGuard, ConfigureGuard, ForceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
