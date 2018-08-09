import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js';
import { QuoteService, OrderService, PriceService, Price, LocalCurrencyPipe, Quote, Order } from '@apttus/ecommerce';
import { SObject } from 'ng-salesforce';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CustomQuote } from '../quote-list/quote-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('quoteChart') quoteChart: ElementRef;
  @ViewChild('orderChart') orderChart: ElementRef;

  orderCount: number = 0;
  quoteCount: number = 0;
  orderList: Array<Order>;
  quoteList: Array<Quote>;
  spent: Price;

  constructor(private quoteService: QuoteService, private orderService: OrderService, private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe) {
    quoteService.setType(CustomQuote);
  }

  ngOnInit() {
    this.spent = new Price(this.localCurrencyPipe);
    Observable.combineLatest(
        this.quoteService.getMyQuotes(),
        this.orderService.getMyOrders(),
        this.orderService.aggregate(`CreatedDate = LAST_N_DAYS:7`),
        this.quoteService.aggregate(`CreatedDate = LAST_N_DAYS:7`))
    .subscribe(([quotes, orders, ag1, ag2]) => {
      this.orderList = orders;
      this.quoteList = quotes;
      this.renderPieWithData(this.quoteChart, quotes, 'Apttus_Proposal__Approval_Stage__c');
      this.renderPieWithData(this.orderChart, orders, 'Apttus_Config2__Status__c');

      this.orderCount = _.get(ag1, '[0].total_records', 0);
      this.quoteCount = _.get(ag2, '[0].total_records', 0);

      const orderPriceList$ = [];
      orders.forEach(order => orderPriceList$.push(this.priceService.getOrderPrice(order)));
      Observable.combineLatest(orderPriceList$).subscribe(prices => {
        prices.forEach(price => this.spent.addPrice(price));
      });

    });
  }

  renderPieWithData(element: ElementRef, records: Array<SObject>, field: string){
    const data = {};
    records.map(r => r[field]).forEach(a => data[a] = (!data[a]) ? 1 : data[a] + 1);
    const myDoughnutChart = new Chart(element.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ]
          }
        ],
        labels: Object.keys(data)
      }
    });
  }

}
