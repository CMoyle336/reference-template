import { Component, OnChanges, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProductAttributeMap, ProductOptionForm, Product, ProductOptionGroup, PriceService, Price } from '@apttus/ecommerce';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnChanges {

  @Input() productOptions: Array<ProductOptionForm>;
  @Input() productAttributes: Array<ProductAttributeMap>;
  @Input() additionalProducts: Array<Product>;
  @Input() product: Product;

  constructor(public sanitizer: DomSanitizer, private priceService: PriceService) { }

  ngOnChanges() {
  }

  hasOptions(optionGroup: ProductOptionGroup): boolean{
    return this.productOptions.some(p => p.productOptionComponent.Apttus_Config2__ProductOptionGroupId__c === optionGroup.Id);
  }

  totalPrice(): Observable<number | Price>{
    const calculations = [this.priceService.getProductPrice(this.product, 1, this.productAttributes.map(p => p.attributeValue), this.productOptions)];
    this.additionalProducts.forEach(p => calculations.push(this.priceService.getProductPrice(p, 1, null, null)));
    return Observable.combineLatest(calculations).map(a => a.reduce((x: Price, y: Price) => { x.addPrice(y); return x;}));
  }

}
