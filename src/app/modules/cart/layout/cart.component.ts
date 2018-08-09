import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, CartService, Order, OrderService, AccountLocation, OrderLineItem } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { TabsetComponent } from 'ngx-bootstrap';
import { Card } from '../component/card-form/card-form.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Angulartics2GoogleAnalyticsEnhancedEcommerce } from 'angulartics2/ga-enhanced-ecom';
declare var ga: Function;

import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @ViewChild('addressTabs') addressTabs: any;
  @ViewChild('addressInfo') addressInfo: ElementRef;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  cart$: Observable<Cart>;
  shippingEqualsBilling: boolean = true;
  order: Order;
  orderConfirmation: Order;
  card: Card;
  loading: boolean = false;
  uniqueId: string;
  paymentState: 'CARD' | 'INVOICE' = 'CARD';

  shippingAddress: AccountLocation = new AccountLocation();
  billingAddress: AccountLocation = new AccountLocation();
  confirmationModal: BsModalRef;
  
  constructor(private cartService: CartService, private orderService: OrderService, private router: Router, private modalService: BsModalService,
              private at: Angulartics2GoogleAnalyticsEnhancedEcommerce) {
    this.uniqueId = _.uniqueId();
  }

  ngOnInit() {
    this.cart$ = this.cartService.getMyCart();
    this.order = new Order();
    this.card = {} as Card;
  }

  selectTab(evt){
      if (evt)
        this.staticTabs.tabs[0].active = true;
      else{
        setTimeout(() => this.staticTabs.tabs[1].active = true, 50);
      }
  }

  submitOrder(){
    if (this.shippingEqualsBilling){
      this.order.ShippingCity__c = this.order.BillingCity__c;
      this.order.ShippingStreet__c = this.order.BillingStreet__c;
      this.order.ShippingState__c = this.order.BillingState__c;
      this.order.ShippingPostalCode__c = this.order.BillingPostalCode__c;
      this.order.ShippingCountry__c = this.order.BillingCountry__c;
    }
    this.loading = true;
    this.orderService.convertCartToOrder(this.order).subscribe(
      res => {
        this.loading = false;
        this.orderConfirmation = res;
        this.analytics();
        this.confirmationModal = this.modalService.show(this.confirmationTemplate);
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  public getId(id: string): string {
    return this.uniqueId + '_' + id;
  }

  analytics(){
    this.orderConfirmation.Apttus_Config2__OrderLineItems__r.records.forEach((lineItem: OrderLineItem) => {
      this.at.ecAddProduct({
        id : lineItem.Apttus_Config2__ProductId__r.ProductCode,
        name : lineItem.Apttus_Config2__ProductId__r.Name,
        price: lineItem.Apttus_Config2__NetPrice__c,
        quantity: lineItem.Apttus_Config2__Quantity__c
      });
    });
    this.at.ecSetAction('purchase', {
      id : this.orderConfirmation.Name,
      affilation : this.orderConfirmation.Apttus_Config2__BillToAccountId__r.Name
    });
    ga('send', 'pageview');
  }
}
