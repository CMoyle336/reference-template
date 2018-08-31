import { Component, OnInit, Input } from '@angular/core';
import { Order } from '@apttus/ecommerce';
import { Card } from '../../../cart/component/card-form/card-form.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentState: 'CARD' | 'INVOICE' = 'CARD';
  card: Card = {} as Card;

  @Input() order: Order;

  constructor() { }

  ngOnInit() {
  }

}
