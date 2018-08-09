import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigureLayoutComponent } from './layout/configure-layout.component';
import { ConfigureGuard } from '../../services/configure.guard';

const routes: Routes = [{
  path : ':productCode',
  component : ConfigureLayoutComponent,
  canActivate : []
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigureRoutingModule { }
