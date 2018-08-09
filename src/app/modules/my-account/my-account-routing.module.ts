import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAccountLayoutComponent } from './layout/my-account-layout.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { OrderListComponent } from './component/order-list/order-list.component';
import { QuoteListComponent } from './component/quote-list/quote-list.component';
import { WishlistsComponent } from './component/wishlists/wishlists.component';
import { AddressBookComponent } from './component/address-book/address-book.component';
import { SettingsComponent } from './component/settings/settings.component';
import { CartListComponent } from './component/cart-list/cart-list.component';
import { ProductCatalogComponent } from './component/product-catalog/product-catalog.component';
import { OrderDetailComponent } from './component/order-detail/order-detail.component';
import { QuoteDetailComponent } from './component/quote-detail/quote-detail.component';

const routes: Routes = [
  {
    path : '',
    component: MyAccountLayoutComponent,
    children : [
      {
        path : 'dashboard',
        component : DashboardComponent
      },
      {
        path : 'orders',
        component : OrderListComponent
      },
      {
        path : 'orders/:orderId',
        component : OrderDetailComponent
      },
      {
        path : 'quotes',
        component : QuoteListComponent
      },
      {
        path: 'quotes/:quoteId',
        component : QuoteDetailComponent
      },
      {
        path : 'wishlists',
        component : WishlistsComponent
      },
      {
        path : 'addresses',
        component : AddressBookComponent
      },
      {
        path : 'settings',
        component : SettingsComponent
      },
      {
        path : 'carts',
        component : CartListComponent
      },
      {
        path : 'catalog',
        component : ProductCatalogComponent
      },
      {
        path : '',
        redirectTo : 'dashboard',
        pathMatch : 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
