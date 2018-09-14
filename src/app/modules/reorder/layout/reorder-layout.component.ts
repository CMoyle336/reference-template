import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order, CartService, CategoryService, Category, Cart, CartProductForm, ProductService, CartItemService, Product, CartItem } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reorder-layout',
  templateUrl: './reorder-layout.component.html',
  styleUrls: ['./reorder-layout.component.scss']
})
export class ReorderLayoutComponent implements OnInit, OnDestroy {
  subList = [];
  cart: Cart;
  categoryTree: Array<Category>;
  order: Order;
  newOrder: Order = new Order();
  group: string;
  productList: Object = {};

  constructor(private orderService: OrderService, private route: ActivatedRoute, private categoryService: CategoryService,
            private cartService: CartService, private productService: ProductService, private cartItemService: CartItemService) {
    this.productService.customFields = ['Digital_Product_Family__c'];
  }

  ngOnInit() {
    this.order = new Order();
    this.subList.push(this.route.params
      .flatMap(r => {
        return Observable.combineLatest(this.cartService.createNewCart(new Cart(), false), this.categoryService.getCategoryTree(), this.orderService.getOrderByName(r.orderId).take(1));
      })
      .take(1)
      .subscribe(([cart, categoryTree, order]) => {
        this.order = order;
        this.newOrder.Apttus_Config2__PrimaryContactId__r = this.order.Apttus_Config2__PrimaryContactId__r;
        this.categoryTree = categoryTree;

        this.subList.push(
          this.productService.where(`ID <> NULL`)
            .take(1)
            .map(productList => productList.map(product => {
              const lineItem = _.get(this.order, 'Apttus_Config2__OrderLineItems__r.records', []).filter(x => x.Apttus_Config2__ProductId__c === product.Id)[0];
              const cartItem = this.cartService.getCartItem(product, (lineItem) ? lineItem.Apttus_Config2__Quantity__c : 0, cart, false, cart.Apttus_Config2__PriceListId__c);
              cartItem['Digital_Product_Family_LI__c'] = product['Digital_Product_Family__c'];
              return cartItem;
            }))
            .subscribe((res: Array<CartItem>) => {
              cart.Apttus_Config2__LineItems__r.records = res;
              this.cart = cart;
            }));
      }));
  }

  ngOnDestroy() {
    this.subList.forEach(sub => {
      if (sub.unsubscribe)
        sub.unsubscribe();
    });
  }

  onItemsAdd(){
    const items = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', []).filter(x => x.Apttus_Config2__Quantity__c > 0);
    if(items.length > 0){
      this.cart.Apttus_Config2__EffectiveDate__c = new Date();
      this.cart.Apttus_Config2__IsPricePending__c = true;
      this.cartService.createNewCart(this.cart).subscribe(
        _cart => {
          items.forEach(item => item.Apttus_Config2__ConfigurationId__c = _cart.Id);
          this.cartItemService.create(items)
            .flatMap(() => this.cartService.priceCart(_cart))
            .flatMap(() => this.cartService.get([_cart.Id]))
            .map(res => res[0])
            .subscribe(
              c => this.cart = c,
              e => console.error(e)
            );
        }
      );
    }
  }

  placeOrder(){
    this.orderService.convertCartToOrder(this.newOrder, this.order.Apttus_Config2__PrimaryContactId__r, this.cart).subscribe(o => this.newOrder = o);
  }
}

export interface LineItem{
  product: Product;
  quantity: number;
}