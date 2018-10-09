import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactLayoutComponent } from './layout/contact-layout.component';

const routes: Routes = [
  {path : '', component: ContactLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
