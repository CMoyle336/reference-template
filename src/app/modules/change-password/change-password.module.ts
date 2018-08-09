import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordLayoutComponent } from './layout/change-password-layout.component';

import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    LaddaModule
  ],
  declarations: [ChangePasswordLayoutComponent]
})
export class ChangePasswordModule { }
