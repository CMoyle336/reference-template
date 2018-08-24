import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { CartItem, OrderLineItem, Product, ProductService, Cart, Order, CartItemService, ProductAttributeService, ProductAttributeValue } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
// import { TCartItem } from '../../models/tier-one.model';

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
  attributeList: any;
  selectedProduct: Product;
  productAttributeValue: ProductAttributeValue;

  get optionGroups() {
    return (this.optionList) ? Object.keys(this.optionList) : null;
  }

  get attributeGroups() {
    return (this.attributeList) ? Object.keys(this.attributeList) : null;
  }


  constructor(private productService: ProductService, public sanitizer: DomSanitizer, private cartItemService: CartItemService, private paService: ProductAttributeService) {
    // this.cartItemService.setType(TCartItem);
  }

  ngOnChanges() {
    let lineItems = [];
    if (this.parent instanceof Order) {
      this.type = 'Order';
      lineItems = _.get(this.parent, 'Apttus_Config2__OrderLineItems__r.records', []);
      this.productService.getProductByCode([this.item.Apttus_Config2__ProductId__r.ProductCode]).take(1).map(res => res[0]).subscribe(p => {
        this.selectedProduct = p;
      });
      this.productAttributeValue = (<OrderLineItem>this.item).Apttus_Config2__DerivedFromId__r.Apttus_Config2__AttributeValueId__r;
    } else {
      this.type = 'Cart';
      lineItems = _.get(this.parent, 'Apttus_Config2__LineItems__r.records', []);
      this.productAttributeValue = (<CartItem> this.item).Apttus_Config2__AttributeValueId__r;
      // Observable.combineLatest(
      //   this.productService.getProductByCode([this.item.Apttus_Config2__ProductId__r.ProductCode]).map(res => res[0]),
      //   this.cartItemService.where('Id = {0}', this.item.Id).map(res => res[0]),
      //   this.paService.getProductAttributes()
      // ).take(1)
      // .subscribe(([product, cartItem]) => {
      //   this.selectedProduct = product;
      //   console.log(product);
      //   console.log(cartItem);
      // });
    }
    
    const options = lineItems.filter(r => r.Apttus_Config2__LineNumber__c === this.item.Apttus_Config2__PrimaryLineNumber__c && r.Apttus_Config2__LineType__c === 'Option');
    this.optionList = _.groupBy(options, 'Apttus_Config2__ProductOptionId__r.Apttus_Config2__ProductOptionGroupId__r.Apttus_Config2__OptionGroupId__r.Apttus_Config2__Label__c');

    this.productService.getProductByCode([this.item.Apttus_Config2__ProductId__r.ProductCode])
      .map(res => res[0])
      .subscribe(product => {
        this.selectedProduct = product;
        this.paService.getProductAttributes(product).subscribe(attributes => {
          this.attributeList = _.groupBy(attributes, 'Apttus_Config2__AttributeGroupId__r.Name');
        });
      });
  }

}
