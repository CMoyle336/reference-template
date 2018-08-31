import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order, CartService, CategoryService, Category, Cart, CartProductForm, CartItem, ProductService, CartItemService } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reorder-layout',
  templateUrl: './reorder-layout.component.html',
  styleUrls: ['./reorder-layout.component.scss']
})
export class ReorderLayoutComponent implements OnInit, OnDestroy {
  subList = [];
  cartSub;
  cart: Cart = new Cart();
  categoryTree: Array<Category>;
  order: Order;
  group: string;
  productList: Object = {};

  constructor(private orderService: OrderService, private route: ActivatedRoute, private categoryService: CategoryService, private cartService: CartService, private productService: ProductService, private cartItemService: CartItemService) { }

  ngOnInit() {
    this.order = new Order();
    this.subList.push(this.route.params
      .flatMap(r => {
        this.group = r.group;
        return Observable.combineLatest(this.categoryService.getCategoryTree([r.group]), this.orderService.getOrderByName(r.orderId).take(1));
      })
      .take(1)
      .subscribe(([categoryTree, order]) => {
        this.order = order;
        this.categoryTree = categoryTree;
        this.subList.push(this.productService.where(`ID <> NULL AND ID IN (SELECT Apttus_Config2__ProductId__c FROM Apttus_Config2__ProductClassification__c WHERE Apttus_Config2__ClassificationId__r.Apttus_Config2__PrimordialId__r.Name = {0})`, this.group)
          .map(productList => productList.map(product => {
            const lineItem = _.get(this.order, 'Apttus_Config2__OrderLineItems__r.records', []).filter(x => x.Apttus_Config2__ProductId__c === product.Id)[0];

            const cartItem: CartItem = new CartItem();
            cartItem.Apttus_Config2__ProductId__r = product;
            cartItem.Apttus_Config2__Quantity__c = _.get(lineItem, 'Apttus_Config2__Quantity__c', 0);
            cartItem.Apttus_Config2__PrimaryLineNumber__c = 1;
            cartItem.Apttus_Config2__PriceListItemId__r = _.get(product, 'Apttus_Config2__PriceLists__r.records[0]', null);
            cartItem.Apttus_Config2__LineType__c = 'Product/Service';
            return cartItem;
          }))
          .subscribe(res => {
            this.cart.Apttus_Config2__LineItems__r.records = res;
            this.productList = _.groupBy(res, 'Apttus_Config2__ProductId__r.Apttus_Config2__Categories__r.records[0].Apttus_Config2__ClassificationId__r.Apttus_Config2__AncestorId__c');
          }));
      }));
  }

  ngOnDestroy() {
    this.subList.forEach(sub => {
      if (sub.unsubscribe)
        sub.unsubscribe();
    });
    if(this.cartSub)
      this.cartSub.unsubscribe();
  }

  onItemsAdd(){
    this.cart.Apttus_Config2__IsPricePending__c = true;
    const handleCart = (cart) => {
      const productFormList: Array<CartProductForm> = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', [])
        .filter(lineItem => lineItem.Apttus_Config2__Quantity__c > 0)
        .map(lineItem => {
          return { quantity: lineItem.Apttus_Config2__Quantity__c, productCode: lineItem.Apttus_Config2__ProductId__r.ProductCode };
        });

      if(!this.cartSub)
        this.cartSub = this.cartService.get([cart.Id]).map(res => res[0]).subscribe(_c => this.cart = _c);
      
      let obsv = Observable.of(null);
      const existingItems = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', []).filter(lineItem => lineItem.Id != null);
      if(existingItems.length > 0)
        obsv = this.cartItemService.delete(existingItems).map(() => existingItems.forEach(item => delete item.Id));
      obsv.flatMap(() => this.cartService.bulkAddProductToCart(productFormList, cart)).subscribe(() => { });
    };

    if(this.cart.Id)
      handleCart(this.cart);
    else
      this.cartService.createNewCart(this.cart).subscribe(cart => handleCart(cart));
  }
}