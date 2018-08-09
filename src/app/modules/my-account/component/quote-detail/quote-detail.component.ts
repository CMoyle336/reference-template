import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuoteService, Quote } from '@apttus/ecommerce';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {

  quote$: Observable<Quote>;

  constructor(private quoteService: QuoteService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.quote$ = this.activatedRoute.params.flatMap(r => this.quoteService.getQuoteByName(r.quoteId));
  }

}
