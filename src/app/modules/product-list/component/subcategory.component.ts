import { Component, OnChanges, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Category } from '@apttus/ecommerce';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'pl-subcategory',
  template: `
    <div class="card">
      <div class="card-body">
          <h5 class="card-title">{{title}}</h5>
          <form [formGroup]="filterGroup" *ngIf="filterGroup">
            <ul class="list-unstyled pl-2">
              <li *ngFor="let category of categoryList" class="custom-control custom-checkbox py-1">
                <input type="checkbox" class="custom-control-input" [id]="category.Id" [formControlName]="category.Id" (change)="onCheckChange($event)">
                <label class="custom-control-label" [for]="category.Id">{{category.Apttus_Config2__Label__c}}</label>
              </li>
            </ul>
          </form>
      </div>
    </div>
  `,
  styles: [`
    li{
      font-size: smaller
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubcategoryComponent implements OnChanges {
  @Input() categoryList: Array<Category>;
  @Input() categories: Array<Category> = [];
  @Input() title: string = 'Subcategories';
  @Output('onFilterChange') onFilterChange: EventEmitter<Array<Category>> = new EventEmitter<Array<Category>>();

  filterGroup: FormGroup;
  timeout: any;

  constructor() { }

  ngOnChanges() {
    this.filterGroup = new FormGroup({});
    if(this.categoryList){
      this.categoryList.forEach(category => {
        this.filterGroup.addControl(category.Id, new FormControl(_.find(this.categories, {'Id' : category.Id})));
      });
    }
  }

  onCheckChange(event){
    if(this.timeout)
      clearTimeout(this.timeout);

    this.categoryList.forEach(category => {
      if(this.filterGroup.controls[category.Id].value === true)
        this.categories.push(category);
      else
        _.remove(this.categories, {Id : category.Id});
    });

    this.timeout = setTimeout(() => this.onFilterChange.emit(this.categories), 1000);

  }

}
