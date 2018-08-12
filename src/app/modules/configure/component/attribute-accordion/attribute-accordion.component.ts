import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ProductAttribute, Product, ProductAttributeMap, ProductAttributeValue, InputFieldComponent } from '@apttus/ecommerce';

@Component({
  selector: 'app-attribute-accordion',
  templateUrl: './attribute-accordion.component.html',
  styleUrls: ['./attribute-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeAccordionComponent implements OnChanges {
  @Input() productAttributeList: Array<ProductAttribute>;
  @Input() product: Product;
  @Output() onChange: EventEmitter<Array<ProductAttributeMap>> = new EventEmitter<Array<ProductAttributeMap>>();

  productAttributeMap: Array<ProductAttributeMap>;

  constructor() { }

  ngOnChanges() {
    this.productAttributeMap = new Array<ProductAttributeMap>();
    if(this.productAttributeList && this.product){
      this.product.Apttus_Config2__AttributeGroups__r.records.forEach(groupMember => {
        this.productAttributeMap.push({
          groupMember: groupMember,
          attributeValue: this.setAttributeDefaults(this.productAttributeList.filter(attr => attr.Apttus_Config2__AttributeGroupId__c === groupMember.Apttus_Config2__AttributeGroupId__c)),
          productAttributeList: this.productAttributeList,
          priceMatrices: null
        });
      });
      this.onChange.emit(this.productAttributeMap.slice(0));
    }
  }

  setAttributeDefaults(productAttributeList: Array<ProductAttribute>): ProductAttributeValue {
    const attributeValue: ProductAttributeValue = new ProductAttributeValue();
    productAttributeList.forEach(attr => {
      attributeValue[attr['_describe'].name] = InputFieldComponent.getDefaultValue(attr['_describe']);
    });
    return attributeValue;
  }

  valueChange(){
    this.onChange.emit(this.productAttributeMap.slice(0));
  }

}
