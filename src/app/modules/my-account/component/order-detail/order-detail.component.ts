import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Order } from '@apttus/ecommerce';
import { OrderService } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: Order;

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit() {
    this.route.params
      .flatMap(r => this.orderService.getOrderByName(r.orderId))
      .subscribe(order => {
        const lineItems = _.get(order, 'Apttus_Config2__OrderLineItems__r.records', []);
        lineItems.forEach(lineItem => lineItem.Apttus_Config2__HasOptions__c = lineItems.filter(r => r.Apttus_Config2__LineNumber__c === lineItem.Apttus_Config2__PrimaryLineNumber__c).length > 0);

        this.order = order;
        console.log(this.order);
      });
  }

}
