import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Category, SearchResults, PriceTier } from '@apttus/ecommerce';

import * as _ from 'lodash';

@Component({
  selector: 'pl-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border p-2 d-flex align-items-center justify-content-between">
      <div>
        Showing {{recordCount > 0 ? offset + 1 : 0}}-{{lastResult}} of {{totalRecords}} results
          <span class="d-none d-md-inline" *ngIf="query"> &nbsp;for your search of&nbsp;<strong>{{query}}</strong></span>
      </div>

      <div class="d-flex align-items-center">
        <div class="input-group input-group-sm mr-3">
          <div class="input-group-prepend">
            <label class="input-group-text" for="sort">Show</label>
          </div>
          <select class="custom-select custom-select-sm" id="size" [(ngModel)]="limit" name="limit">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div class="input-group input-group-sm mr-3">
          <div class="input-group-prepend">
            <label class="input-group-text" for="sort">Sort By</label>
          </div>
          <select class="custom-select custom-select-sm" id="sort" (change)="onSortChange.emit($event.target.value)">
            <option>Relevance</option>
            <option [value]="'Name'">Name</option>
            <option [value]="'Rating_Score__c'">Rating</option>
          </select>
        </div>
        <a href="javascript:void(0)"
            class="btn btn-link btn-sm p-0 move-down"
            [class.disabled]="view == 'grid'"
            [attr.disabled]="view == 'grid'"
            (click)="onViewChange.emit('grid')">
          <span class="oi oi-grid-two-up"></span>
        </a>
        <a href="javascript:void(0)"
            class="btn btn-link btn-sm py-0"
            [class.disabled]="view == 'list'"
            [attr.disabled]="view == 'list'"
            (click)="onViewChange.emit('list')">
          <span class="oi oi-list"></span>
        </a>
      </div>
    </div>
  `,
  styles : [`
    :host{
      font-size: smaller;
    }
    .move-down{
      margin-top: 1px;
    }
  `]
})
export class ResultsComponent implements OnChanges{
  @Input() recordCount: number = 0;
  @Input() limit: number = 12;
  @Input() offset: number = 0;
  @Input() page: number = 1;
  @Input() view: 'grid' | 'list';
  @Input() query: string;

  @Output() onViewChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSortChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnChanges() {}

  get totalRecords(): string{
    if(this.recordCount > 2000)
      return '2000+';
    else if(this.recordCount)
      return this.recordCount.toString();
  }

  get lastResult(){
    return ((this.limit * this.page) >= this.recordCount) ? this.recordCount : (this.limit * this.page);
  }
}
