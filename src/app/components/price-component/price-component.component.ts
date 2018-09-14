import { Component, OnInit, ChangeDetectionStrategy, Input, DoCheck, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Cart, Product, CartItem, ProductOptionComponent, Order, ProductAttributeValue, ProductOptionForm, Price, PriceService } from '@apttus/ecommerce';

/**
 * Wrapper component for displaying the price of a record. Supports cart, product, cart item, product options and orders.
 * Change detection on this component has been tuned, so use this component in favor of using the price pipes directly.
 * ### Example:
 ```html
  <apt-price [record]="product" [quantity]="1" [attributes]="attributeValueList" [options]="productOptionList" [formatted]="true" [type]="total"></apt-price>
 ```
 */
@Component({
  selector: 'app-price',
  template: `
    <ng-container *ngIf="price">
      <ng-container *ngIf="formatted; else uf">
        {{price[type + 'Price$'] | async}}
      </ng-container>
      <ng-template #uf>
        {{price[type + 'Price']}}
      </ng-template>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceComponent implements DoCheck, OnChanges, OnDestroy {

  /**
   * The input record to display the price for. Can be of type Cart, Product, CartItem, ProductOptionComponent or Order
   */
  @Input() record: Cart | Product | CartItem | ProductOptionComponent | Order;

  /**
   * The cart record to calculate the price of a cart item for. If left undefined, will use the current cart.
   */
  @Input() cart?: Cart;

  /**
   * The quantity of the record (defaults to 1)
   */
  @Input() quantity?: number = 1;

  /**
   * Optional attributes to use in calculating the price
   */
  @Input() attributes?: Array<ProductAttributeValue> = [];

  /**
   * Optional product options to use in calculating the price.
   */
  @Input() options?: Array<ProductOptionForm> = [];

  /**
   * Optional boolean argument to display the price as a formatted currency or as a raw number (defaults to true)
   */
  @Input() formatted: boolean = true;

  /**
   * The type of the output; total price, base price, discounted price or unit price (defaults to total)
   */
  @Input() type: 'total' | 'base' | 'discount' | 'unit' = 'total';

  private subscription;
  private _record: Cart | Product | CartItem | ProductOptionComponent | Order;
  private _quantity?: number = 1;
  private _attributes?: Array<ProductAttributeValue> = null;
  private _options?: Array<ProductOptionForm> = null;

  price: Price;

  constructor(private priceService: PriceService, private cdr: ChangeDetectorRef) { }

  /**
   * @ignore
   */
  getObservable(): Observable<Price> {
    if (this.record) {
      if (this.record instanceof Cart || this.record['Apttus_Config2__AccountId__c'])
        return this.priceService.getCartPrice(<Cart>this.record);
      else if (this.record instanceof Product || this.record['ProductCode'])
        return this.priceService.getProductPrice(<Product>this.record, this.quantity, this.attributes, this.options);
      else if (this.record instanceof CartItem || this.record['Apttus_Config2__PrimaryLineNumber__c'])
        return this.priceService.getCartItemPrice(<CartItem>this.record, this.cart);
      else if (this.record instanceof ProductOptionComponent || this.record['Apttus_Config2__Default__c'])
        return this.priceService.getOptionAdjustmentPrice(<ProductOptionComponent>this.record, this.quantity);
      else if (this.record instanceof Order || this.record['Apttus_Config2__AutoActivateOrder__c'])
        return this.priceService.getOrderPrice(<Order>this.record);
      else
        return null;
    } else
      return null;
  }

  /**
   * @ignore
   */
  ngDoCheck() {
    if (!(_.isEqual(this.record, this._record) && _.isEqual(this.quantity, this._quantity) && _.isEqual(this.attributes, this._attributes) && _.isEqual(this.options, this._options))) {
      this.cdr.markForCheck();
      this._record = _.clone(this.record);
      this._quantity = this.quantity;
      this._attributes = _.clone(this.attributes);
      this._options = _.clone(this.options);
      this.ngOnChanges();
    }
  }

  /**
   * @ignore
   */
  ngOnChanges() {
    this.ngOnDestroy();
    this.getObservable().subscribe(price => {
      this.price = price;
      this.cdr.markForCheck();
    });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    if (this.subscription && this.subscription.unsubscribe)
      this.subscription.unsubscribe();
  }
}
