import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product, ProductOptionForm, ProductOptionComponent, ProductCarouselComponent } from '@apttus/ecommerce';

@Component({
  selector: 'app-option-accordion',
  templateUrl: './option-accordion.component.html',
  styleUrls: ['./option-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionAccordionComponent{
  @Input() product: Product;
  @Input() productOptionList: Array<ProductOptionForm> = new Array<ProductOptionForm>();
  
  slideConfigRequired = ProductCarouselComponent.getConfig(4, false, true, false, true);
  slideConfig = ProductCarouselComponent.getConfig(5, false, true, false, true);

  constructor() { }
  log(){
    console.log('here');
  }
  toggleComponent(component: ProductOptionComponent) {
    if (component.Apttus_Config2__ProductOptionGroupId__r.Apttus_Config2__MaxOptions__c === 1) {
      this.productOptionList = this.productOptionList.filter(option => option.productOptionComponent.Apttus_Config2__ProductOptionGroupId__c !== component.Apttus_Config2__ProductOptionGroupId__c);
      this.productOptionList.push({
        productOptionComponent: component,
        attributeValues: null,
        quantity: 1
      });
    }
    else {
      if (this.selected(component))
        this.productOptionList = this.productOptionList.filter(option => option.productOptionComponent.Id !== component.Id);
      else
        this.productOptionList.push({
          productOptionComponent: component,
          attributeValues: null,
          quantity: 1
        });
    }
  }

  selected(component: ProductOptionComponent) {
    const existing = this.productOptionList.filter(option => option.productOptionComponent.Id === component.Id)[0];
    return (existing != null);
  }

  getOptionForm(component: ProductOptionComponent){
    const ret = this.productOptionList.filter(option => option.productOptionComponent.Id === component.Id)[0];
    return (ret) ? ret : {quantity: 1};
  }

  // getGroupOptions(optionGroup: ProductOptionGroup): Array<ProductOptionForm> {
  //   return this.productOptionList.filter(option => option.productOptionComponent.Apttus_Config2__ProductOptionGroupId__c === optionGroup.Id);
  // }

  // optionGroupValid(optionGroup: ProductOptionGroup): boolean {
  //   const selectedOptions = this.getGroupOptions(optionGroup);
  //   let totalQuantity = 0;
  //   if (selectedOptions && selectedOptions.length > 0)
  //     totalQuantity = selectedOptions.map(r => r.quantity).reduce((accumulator, currentValue) => accumulator + currentValue);

  //   return (selectedOptions.length >= _.get(optionGroup, 'Apttus_Config2__MinOptions__c', 0) || _.get(optionGroup, 'Apttus_Config2__MinOptions__c') == null)
  //     && (selectedOptions.length <= _.get(optionGroup, 'Apttus_Config2__MaxOptions__c', 9999999) || _.get(optionGroup, 'Apttus_Config2__MaxOptions__c') == null)
  //     && (totalQuantity >= _.get(optionGroup, 'Apttus_Config2__MinTotalQuantity__c', 0) || _.get(optionGroup, 'Apttus_Config2__MinTotalQuantity__c') == null)
  //     && (totalQuantity <= _.get(optionGroup, 'Apttus_Config2__MaxTotalQuantity__c', 9999999) || _.get(optionGroup, 'Apttus_Config2__MaxTotalQuantity__c') == null);
  // }

}
