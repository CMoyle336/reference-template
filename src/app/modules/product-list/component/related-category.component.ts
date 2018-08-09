import { Component, OnChanges, ChangeDetectionStrategy, Input } from '@angular/core';
import { Category } from '@apttus/ecommerce';

@Component({
  selector: 'pl-related-categories',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{title}}</h5>
        <ul class="list-unstyled">
          <li *ngFor="let category of categoryList" [class.active]="category.Id == categoryId">
            <a href="javascript:void(0)" 
              [routerLink]="'/product-list/' + category.Name" 
              class="btn btn-link btn-sm py-1"
              [class.disabled]="category.Id === categoryId"
              [attr.disabled]="category.Id === categoryId">{{category.Apttus_Config2__Label__c}}</a>
          </li>
        </ul>
      </div>
    </div>

    
  `,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedCategoryComponent implements OnChanges {
  @Input() categoryList: Array<Category>;
  @Input() categoryId: string;
  @Input() title: string = 'Related Categories';

  constructor() { }

  ngOnChanges() {
  }

}
