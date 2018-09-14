import { Component, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Order, Cart, Category, PriceService, Price, LocalCurrencyPipe } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectItemsComponent implements OnChanges {
  subList = [];

  @Input() order: Order;
  @Input() cart: Cart = new Cart();
  @Input() group: string;
  @Input() categoryTree: Array<Category>;

  _cart: Cart;
  cartLoading: boolean = false;
  private categoryMap: Object = {};

  productList: Object = {};

  get groupList() {
    return Object.keys(this.productList);
  }

  getPriceForCategory(categoryId: string): Observable<Price>{
    const products = this.productList[categoryId];
    const obsvArray = [];
    if(products){
      products.forEach(p => obsvArray.push(this.priceService.getProductPrice(p.product, p.quantity)));
      return Observable.combineLatest(obsvArray).take(1).map(priceList => {
        const y = new Price(this.localCurrencyPipe);
        priceList.forEach(x => y.addPrice(x));
        return y;
      });
    }else
      return Observable.of(new Price(this.localCurrencyPipe));
  }

  constructor(private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe, private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  addToCart() {}

  ngOnChanges() {
    this.onChange();
  }

  onChange() {
    this.setTotalQuickfinderItems();
    this.productList = _.groupBy(_.get(this.cart, 'Apttus_Config2__LineItems__r.records', []), 'Apttus_Config2__ProductId__r.Apttus_Config2__Categories__r.records[0].Apttus_Config2__ClassificationId__r.Apttus_Config2__AncestorId__c');
  }

  setTotalQuickfinderItems(){
    const quickFinderItems = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', []).filter(lineItem => lineItem['Digital_Product_Family_LI__c'] === 'Quickfinder');
    const totalQuickfinderItems = _.sumBy(quickFinderItems, 'Apttus_Config2__Quantity__c');
    quickFinderItems.forEach(item => item['QFTotalqty__c'] = totalQuickfinderItems);
  }

  getProducts(category){
    if(this.categoryMap[category.Id])
      return this.categoryMap[category.Id];
    else{
      let x = [];
      if (this.productList[category.Id])
        x = x.concat(this.productList[category.Id]);
      category._children.forEach(child => {
        if (this.productList[child.Id])
          x = x.concat(this.productList[child.Id]);
      });

      this.categoryMap[category.Id] = x;
      return x;
    }
  }
}
