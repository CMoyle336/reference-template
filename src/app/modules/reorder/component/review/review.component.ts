import { Component, OnChanges, Input } from '@angular/core';
import { Cart } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnChanges {

  @Input() cart: Cart;
  completePercent: number = 100;

  constructor() { }

  ngOnChanges() {
    const pendingItems = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', []).filter(lineItem => lineItem.Apttus_Config2__PricingStatus__c === 'Pending').length;
    const totalItems = _.get(this.cart, 'Apttus_Config2__LineItems__r.records', []).length;
    this.completePercent = ((totalItems - pendingItems) / totalItems) * 100;
  }

}
