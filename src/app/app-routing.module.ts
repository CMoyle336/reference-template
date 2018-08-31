import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from './services/route.guard';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path : 'ChangePassword', loadChildren : './modules/change-password/change-password.module#ChangePasswordModule'},
  { path: '', loadChildren: './modules/home/home.module#HomeModule', canActivate: [RouteGuard] },
  { path: 'product', loadChildren: './modules/product-details/product-details.module#ProductDetailsModule', canActivate: [RouteGuard] },
  { path: 'configure', loadChildren : './modules/configure/configure.module#ConfigureModule', canActivate: [RouteGuard] },
  { path: 'product-list', loadChildren: './modules/product-list/product-list.module#ProductListModule', canActivate: [RouteGuard] },
  { path: 'search/:query', loadChildren: './modules/product-list/product-list.module#ProductListModule', canActivate: [RouteGuard] },
  { path: 'cart', loadChildren: './modules/cart/cart.module#CartModule', canActivate: [RouteGuard] },
  { path: 'my-account', loadChildren: './modules/my-account/my-account.module#MyAccountModule', canActivate: [RouteGuard, AuthGuard]},
  { path: 'reorder', loadChildren: './modules/reorder/reorder.module#ReorderModule', canActivate: [RouteGuard, AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
