import { Component, OnInit, ChangeDetectionStrategy, Input, DoCheck, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocalCurrencyPipe, PriceService, Price, CartItem, Cart } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-category-price',
  template: `<strong>
              {{price?.totalPrice$ | async}}
            </strong>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPriceComponent implements OnInit, DoCheck, OnChanges {
  price: Price;
  private _cartItemList: Array<CartItem> = [];
  @Input() cartItemList: Array<CartItem> = [];
  @Input() cart: Cart;

  constructor(private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngDoCheck(){
    if (this.cartItemList){
      this.cartItemList.forEach(p => {
        const item = this._cartItemList.filter(x => x.Apttus_Config2__ProductId__c === p.Apttus_Config2__ProductId__c)[0];
        if (!item || !_.isEqual(item, p)) {
          this.ngOnChanges();
        }
      });
    }
  }

  ngOnChanges() {
    this._cartItemList = _.cloneDeep(this.cartItemList);
    const obsvArray = [];
    if (this.cartItemList && this.cartItemList.length > 0) {
      this.cartItemList.forEach(p => obsvArray.push(this.priceService.getCartItemPrice(p, this.cart)));
      Observable.combineLatest(obsvArray).take(1).subscribe(priceList => {
        const y = new Price(this.localCurrencyPipe);
        priceList.forEach(x => y.addPrice(x));
        this.price = y;
        this.cdr.detectChanges();
      });
    } else
      this.price = new Price(this.localCurrencyPipe);
  }

}
