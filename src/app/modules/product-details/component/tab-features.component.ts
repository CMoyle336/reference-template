import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Product } from '@apttus/ecommerce';

@Component({
  selector: 'pdp-tab-features',
  template: `
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col" class="border-top-0">#</th>
          <th scope="col" class="border-top-0">Feature</th>
          <th scope="col" class="border-top-0">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let feature of product?.Apttus_Config2__ProductFeatureValues__r?.records; let i = index">
          <th scope="row">{{i + 1}}</th>
          <td>{{feature.Apttus_Config2__FeatureId__r.Name}}</td>
          <td>{{feature.Apttus_Config2__Value__c}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    :host{
      font-size: smaller;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabFeaturesComponent {
  @Input() product: Product;

  constructor() { }

}
