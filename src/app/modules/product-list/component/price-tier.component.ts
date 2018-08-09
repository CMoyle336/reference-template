import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PriceTier } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Component({
  selector: 'pl-price-tier',
  template: `
    <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">{{title}}</h5>
            <a href="javascript:void(0)" *ngIf="tier" (click)="clear()">Clear</a>
          </div>
          <ul class="list-unstyled">
            <li *ngFor="let option of tierList; let i = index" [class.active]="option?.minPrice == tier?.minPrice">
              <a href="javascript:void(0)"
                (click)="selectPrice(option)"
                class="btn btn-link btn-sm py-1"
                [class.disabled]="option?.minPrice == tier?.minPrice">
                  <span *ngIf="i == 0">under {{(option.maxPrice | formatCurrency | async)}}</span>
                  <span *ngIf="i > 0 && i < (tierList.length - 1)">{{(option.minPrice | formatCurrency | async) }} to {{ (option.maxPrice | formatCurrency | async)}}</span>
                  <span *ngIf="i == (tierList.length - 1)">over {{option.minPrice | formatCurrency | async}}</span>
              </a>
            </li>
          </ul>
        </div>
    </div>
  `,
  styles: [`
    :host a{
      font-size: smaller
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTierComponent implements OnChanges {
  @Input('data') data: any;
  @Input('tierCount') tierCount: number = 5;
  @Input('tier') tier: PriceTier;
  @Input() title: string = 'Prices';
  @Output() onPriceChange: EventEmitter<PriceTier> = new EventEmitter<PriceTier>();

  private points: Array<number> = [1, 10, 25, 50, 100, 1000, 10000, 100000, 1000000];
  public tierList: Array<PriceTier>;

  constructor(private cdr: ChangeDetectorRef){}

  selectPrice(tier: PriceTier){
    this.tier = (this.tier && this.tier.minPrice === tier.minPrice) ? null : tier;
    this.onPriceChange.emit(this.tier);
  }

  clear(){
    this.tier = null;
    this.onPriceChange.emit(null);
  }

  ngOnChanges() {

    this.tierList = null;
    if(_.get(this.data, 'min_Apttus_Config2__ListPrice__c') != null && _.get(this.data, 'max_Apttus_Config2__ListPrice__c') != null && this.data.min_Apttus_Config2__ListPrice__c < this.data.max_Apttus_Config2__ListPrice__c){
      this.tierList = new Array<PriceTier>();
      let min = this.data.min_Apttus_Config2__ListPrice__c;
      let max = this.data.max_Apttus_Config2__ListPrice__c;

      let step = ((max - min) / this.tierCount);
      let tier = 1;
      for(let point of this.points){
        if((point * 2) > step){
          tier = point;
          break;
        }
      }

      for(let x = 1; x<=this.tierCount; x++){
        if(x === 1)
          this.tierList.push({minPrice : 0, maxPrice : tier});
        else if(x < (this.tierCount)){
          let tierMin = (tier * (x - 1));
          let tierMax = (tier * x);
          this.tierList.push({minPrice : tierMin, maxPrice : tierMax});
        }else{
          this.tierList.push({minPrice : (tier * (x - 1)), maxPrice : null});
        }
      }
    }
  }

}
