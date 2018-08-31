import { Component, Input, OnChanges } from '@angular/core';
import { ProductService, CartItem, Order, Cart, CartProductForm, CartService, Category } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.scss']
})
export class SelectItemsComponent implements OnChanges {
  subList = [];

  @Input() order: Order;
  @Input() cart: Cart = new Cart();
  @Input() group: string;
  @Input() categoryTree: Array<Category>;
  @Input() productList: Object = {};

  _cart: Cart;
  cartLoading: boolean = false;
  

  get groupList() {
    return Object.keys(this.productList);
  }

  constructor() { }

  addToCart() {}

  ngOnChanges() {
    this._cart = this.cart;
  }

  onChange(id) {
    this._cart = _.cloneDeep(this.cart);
  }
}
