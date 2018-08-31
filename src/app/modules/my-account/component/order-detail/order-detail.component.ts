import { Component, OnInit, TemplateRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Order, OrderLineItem, OrderService, ProductService, Product } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  modalRef: BsModalRef;
  order: Order;
  selectedLineItem: OrderLineItem;
  productList = {};
  lineItemMap = {};

  get productGroups(){
    return Object.keys(this.productList);
  }

  constructor(private route: ActivatedRoute, private orderService: OrderService, private modalService: BsModalService, private productService: ProductService) { }

  ngOnInit() {
    this.route.params
      .flatMap(r => this.orderService.getOrderByName(r.orderId))
      .subscribe(order => {
        this.order = order;
        this.productService.where(`ID IN ({0})`, ProductService.arrayToCsv(_.get(this.order, 'Apttus_Config2__OrderLineItems__r.records', [])
          .filter(p => p.Apttus_Config2__LineType__c === 'Product/Service')
          .map(o => o.Apttus_Config2__ProductId__c)))
          .subscribe(y => {
            this.productList = _.groupBy(y, 'Digital_Product_Family__c');
            this.lineItemMap = _.groupBy(_.get(this.order, 'Apttus_Config2__OrderLineItems__r.records', []), 'Apttus_Config2__ProductId__c');
          });
      });
  }

  openModal(template: TemplateRef<any>, lineItem: OrderLineItem) {
    this.selectedLineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }

}
