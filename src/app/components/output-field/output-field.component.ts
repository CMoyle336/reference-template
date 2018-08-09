import { Component, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { SObjectService } from 'ng-salesforce';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'apt-output-field',
  templateUrl: './output-field.component.html',
  styleUrls: ['./output-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutputFieldComponent implements OnChanges {
  @Input('objectName') objectName: string;
  @Input('fieldName') fieldName: string;
  @Input('value') value: string;
  @Input('label') label: string;

  field$: Observable<any>;

  constructor(private sobjectService: SObjectService) { }

  ngOnChanges() {
    this.field$ = this.sobjectService.describe(this.objectName).map(o => o.fields).map(f => f.filter(y => y.name === this.fieldName)[0]);
    this.field$.subscribe(res => console.log(res));
  }

}
