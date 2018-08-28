import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService, Quote, QuoteLineItem } from '@apttus/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {

  quote$: Observable<Quote>;
  selectedLineItem: QuoteLineItem;
  modalRef: BsModalRef;

  constructor(private quoteService: QuoteService, private activatedRoute: ActivatedRoute, private modalService: BsModalService) {}

  ngOnInit() {
    this.quote$ = this.activatedRoute.params.flatMap(r => this.quoteService.getQuoteByName(r.quoteId));
    this.quote$.subscribe(r => console.log(r));
  }

  openModal(template: TemplateRef<any>, lineItem: QuoteLineItem) {
    this.selectedLineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }
}