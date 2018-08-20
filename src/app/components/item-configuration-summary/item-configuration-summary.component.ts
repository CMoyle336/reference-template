import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { CartItem, OrderLineItem, Product, ProductService, Cart, Order } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'apt-item-configuration-summary',
  templateUrl: './item-configuration-summary.component.html',
  styleUrls: ['./item-configuration-summary.component.scss']
})
export class ItemConfigurationSummaryComponent implements OnChanges {

  @Input() item: CartItem | OrderLineItem;
  @Input() parent: Cart | Order;
  type: 'Cart' | 'Order' = 'Cart';
  optionList: any;
  get optionGroups(){
    return Object.keys(this.optionList);
  }
  selectedProduct: Product;

  constructor(private productService: ProductService, public sanitizer: DomSanitizer) { }

  ngOnChanges() {
    if(this.parent instanceof Order){
      this.type = 'Order';
      const lineItems = _.get(this.parent, 'Apttus_Config2__OrderLineItems__r.records', []);
      const options = lineItems.filter(r => r.Apttus_Config2__LineNumber__c === this.item.Apttus_Config2__PrimaryLineNumber__c && r.Apttus_Config2__LineType__c === 'Option');
      this.optionList = _.groupBy(options, 'Apttus_Config2__ProductOptionId__r.Apttus_Config2__ProductOptionGroupId__r.Apttus_Config2__OptionGroupId__r.Apttus_Config2__Label__c');
    }else{
      this.type = 'Cart';
    }
    this.productService.getProductByCode([this.item.Apttus_Config2__ProductId__r.ProductCode]).take(1).map(res => res[0]).subscribe(p => this.selectedProduct = p);
  }

}
