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
  
  constructor(private route: ActivatedRoute, private orderService: OrderService, private modalService: BsModalService, private productService: ProductService) { }

  ngOnInit() {
    this.route.params
      .flatMap(r => this.orderService.getOrderByName(r.orderId))
      .subscribe(order => {
        this.order = order;
      });
  }

  openModal(template: TemplateRef<any>, lineItem: OrderLineItem) {
    this.selectedLineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }

}
