import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orderList$: Observable<Array<Order>>;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderList$ = this.orderService.getMyOrders();
  }

}

