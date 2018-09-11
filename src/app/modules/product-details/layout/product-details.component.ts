import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService, Product, ConstraintRuleService, ConstraintRule, PriceMatrixService, PriceMatrixEntry } from '@apttus/ecommerce';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { TRProduct } from '../../../models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  rules: Array<ConstraintRule>;
  relatedProducts$: Observable<Array<Product>>;
  similarProducts$: Observable<Array<Product>>;

  replacementProducts$: Observable<Array<Product>>;
  replacementRules: Array<any>;
  volumeDiscounts: Array<PriceMatrixEntry>;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cdr: ChangeDetectorRef,
              private priceMatrixService: PriceMatrixService,
              private constraintRuleService: ConstraintRuleService) { 
              this.productService.setType(TRProduct);
  }

  ngOnInit() {
    this.route.params
      .filter(params => params['productCode'] != null)
      .map(params => params['productCode'])
      .flatMap(productCode => {
        this.product = null;
        this.rules = null;
        this.replacementRules = null;
        return this.productService.getProductsByCode([productCode])
      })
      .map(res => res[0])
      .filter(product => product != null)
      .subscribe(product => this.onProductLoad(product));
  }


  onProductLoad(product: Product){
    console.log(product);
    this.relatedProducts$ = null;
    this.replacementProducts$ = null;
    this.replacementRules = null;
    this.volumeDiscounts = null;

    this.product = product;
    this.relatedProducts$ = this.productService.getProductsByCategory(_.get(product, 'Apttus_Config2__Categories__r.records[0].Apttus_Config2__ClassificationId__r.Apttus_Config2__AncestorId__c'));
    this.similarProducts$ = this.productService.getProductsByCategory(_.get(product, 'Apttus_Config2__Categories__r.records[0].Apttus_Config2__ClassificationId__r.Apttus_Config2__PrimordialId__c'));

    // this.constraintRuleService.getConstraintRules(product).take(1).subscribe(rules => {
    //   this.rules = rules;

    //   this.replacementRules = _.flatten(rules.map(r => r.Apttus_Config2__ConstraintRuleActions__r.records.filter(a => a.Apttus_Config2__ActionType__c === 'Replacement')));
    //   if(this.replacementRules.length > 0)
    //     this.replacementProducts$ = this.productService.get(this.replacementRules.map(p => p.Apttus_Config2__ProductId__c));
    // });
    this.priceMatrixService.getPriceMatrixData([this.product.Apttus_Config2__PriceLists__r.records[0]]).subscribe(r => {
      r.forEach(matrix => {
        let hasQuantityRule = false;
        for(let i = 1; i<= 6; i++){
          hasQuantityRule = (_.get(matrix, 'Apttus_Config2__Dimension' + i + 'Id__r.Apttus_Config2__Type__c') === 'Quantity') ? true : hasQuantityRule;
        }
        if(hasQuantityRule)
          this.volumeDiscounts = matrix.Apttus_Config2__MatrixEntries__r.records;
      });
    });
    // this.recommendedProducts$ = this.constraintRuleService.getProductsForContstraintRuleCondition(_.get(product, 'Apttus_Config2__ConstraintRuleConditions__r.records'), 'Recommendation');
    // this.includedProducts$ = this.constraintRuleService.getProductsForContstraintRuleCondition(_.get(product, 'Apttus_Config2__ConstraintRuleConditions__r.records'), 'Inclusion');
  }

  changeTab($evt){
    this.cdr.detectChanges();
  }

}
