import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product, OrderService, Order, CartService, CartProductForm } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.scss']
})
export class ReorderComponent implements OnInit, OnDestroy {
  productList: Object = {};
  order: Order;
  subList = [];
  cartLoading: boolean = false;
  constructor(private productService: ProductService, private orderService: OrderService, private route: ActivatedRoute, private cartService: CartService) { }

  get groupList(){
    return Object.keys(this.productList);
  }

  ngOnInit() {
    this.subList.push(this.route.params
      .flatMap(r => this.orderService.getOrderByName(r.orderId))
      .take(1)
      .subscribe(order => {
        this.order = order;
        this.onOrder();
      }));
  }

  onOrder(){
    this.subList.push(this.productService.where(`ID <> NULL`)
      .map(productList => productList.map(product => {
        const lineItem = _.get(this.order, 'Apttus_Config2__OrderLineItems__r.records', []).filter(x => x.Apttus_Config2__ProductId__c === product.Id)[0];
        return { quantity: _.get(lineItem, 'Apttus_Config2__Quantity__c', 0), product: product };
      }))
      .subscribe(res => this.productList = _.groupBy(res, 'product.Digital_Product_Family__c')));
  }

  ngOnDestroy(){
    this.subList.forEach(sub => {
      if(sub.unsubscribe)
        sub.unsubscribe();
    });
  }

  addToCart(){
    this.cartLoading = true;
    const flatProductList = _.flatten(Object.values(this.productList));
    const productForm: Array<CartProductForm> = flatProductList.filter(m => m.quantity > 0).map(m => {
      return {
        productCode: m.product.ProductCode,
        quantity: m.quantity
      };
    });
    this.cartService.bulkAddProductToCart(productForm)
      .subscribe(
        res => this.cartLoading = false,
        err => {
          console.error(err);
          this.cartLoading = false;
        });
  }

}

export interface ProductQuantityMap{
  quantity: number;
  product: Product;
}
