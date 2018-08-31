import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReorderLayoutComponent } from './layout/reorder-layout.component';

const routes: Routes = [{
  path : ':group/:orderId',
  component : ReorderLayoutComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReorderRoutingModule { }
