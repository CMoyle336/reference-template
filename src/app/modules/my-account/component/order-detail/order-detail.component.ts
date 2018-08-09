import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Order } from '@apttus/ecommerce';
import { OrderService } from '@apttus/ecommerce';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order$: Observable<Order>;

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit() {
    this.order$ = this.route.params.flatMap(r => this.orderService.getOrderByName(r.orderId));
  }

}
