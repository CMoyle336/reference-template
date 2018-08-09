import { Component, OnChanges, ChangeDetectionStrategy, Input } from '@angular/core';
import { Category } from '@apttus/ecommerce';

@Component({
  selector: 'pl-breadcrumb',
  template: `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="javascript:void(0)" [routerLink]="['/']">Home</a>
        </li>

        <li class="breadcrumb-item" *ngFor="let crumb of breadcrumbs; let l = last" [class.active]="l">
          <a href="javascript:void(0)" [routerLink]="['/product-list', crumb.Name]" *ngIf="!l">{{crumb.Apttus_Config2__Label__c}}</a>
          <span *ngIf="l">{{crumb.Apttus_Config2__Label__c}}</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnChanges {

  @Input() breadcrumbs: Array<Category>;

  constructor() { }

  ngOnChanges() {}

}
