import { Component, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '@apttus/ecommerce';

@Component({
  selector: 'pl-field-filter',
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{(title) ? title : field?.label}}</h5>
        <apt-input-field [field]="field" (change)="handleChange($event)" [(ngModel)]="data" [label]="false" [allowEmpty]="true"></apt-input-field>
      </div>
    </div>
  `,
  styles: [`
    :host{
      font-size: smaller;
    }
  `]
})
export class FieldFilterComponent implements OnChanges {
  @Input() fieldName: string;
  @Input() title: string;
  @Output() fieldValueChange: EventEmitter<FieldFilter> = new EventEmitter<FieldFilter>();

  field: any;
  data: any;
  constructor(private productService: ProductService) { }

  ngOnChanges() {
    this.productService.describe().subscribe(
      res => this.field = res.fields.filter(f => f.name === this.fieldName)[0],
      err => console.log(err)
    );
  }

  handleChange(evt){
    this.fieldValueChange.emit({
      field : this.field.name,
      value : this.data
    });
  }
}

export interface FieldFilter{
  field: string;
  value: any;
}
