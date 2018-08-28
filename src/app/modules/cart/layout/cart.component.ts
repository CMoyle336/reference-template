import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Cart, CartService, Order, OrderService, Contact, ContactService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { TabsetComponent } from 'ngx-bootstrap';
import { Card } from '../component/card-form/card-form.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


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
  primaryContact: Contact;

  shippingEqualsBilling: boolean = true;
  order: Order;
  orderConfirmation: Order;
  card: Card;
  loading: boolean = false;
  uniqueId: string;
  paymentState: 'CARD' | 'INVOICE' = 'CARD';
  confirmationModal: BsModalRef;

  constructor(private cartService: CartService, private orderService: OrderService, private modalService: BsModalService, private contactService: ContactService) {
    this.uniqueId = _.uniqueId();
  }

  ngOnInit() {
    this.cart$ = this.cartService.getMyCart();
    this.contactService.getMyContact().subscribe(c => this.primaryContact = c);
    this.order = new Order();
    this.card = {} as Card;
  }

  selectTab(evt) {
    if (evt)
      this.staticTabs.tabs[0].active = true;
    else {
      setTimeout(() => this.staticTabs.tabs[1].active = true, 50);
    }
  }

  submitOrder() {
    this.primaryContact.MailingCountry = this.primaryContact.MailingCountryCode;
    this.primaryContact.MailingState = this.primaryContact.MailingStateCode;
    this.loading = true;
    this.orderService.convertCartToOrder(this.order, this.primaryContact).subscribe(
      res => {
        this.loading = false;
        this.orderConfirmation = res;
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
}
