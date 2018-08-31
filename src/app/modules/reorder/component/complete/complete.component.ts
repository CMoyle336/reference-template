import { Component, OnInit, Input } from '@angular/core';
import { Order } from '@apttus/ecommerce';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  @Input() order: Order;

  constructor() { }

  ngOnInit() {
  }

}
