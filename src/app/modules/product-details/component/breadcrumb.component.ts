import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Product, Category } from '@apttus/ecommerce';

@Component({
  selector: 'pdp-breadcrumb',
  template: `
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="javascript:void(0)" [routerLink]="'/home'" class="text-primary">Home</a></li>
      <li class="breadcrumb-item" *ngFor="let category of categoryList">
        <a href="javascript:void(0)" [routerLink]="'/product-list/' + category.Name" class="text-primary">{{category.Apttus_Config2__Label__c}}</a>
      </li>
      <li class="breadcrumb-item active">{{product?.Name}}</li>
    </ol>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {
  @Input() product: Product;
  @Input() categoryList: Array<Category>;

  constructor() { }

  ngOnInit() {
  }

}
