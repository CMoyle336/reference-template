import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProductService, ConstraintRuleService } from '@apttus/ecommerce';
import * as _ from 'lodash';

@Injectable()
export class ConfigureGuard implements CanActivate {

    constructor(private router: Router, private productService: ProductService, private constraintRuleService: ConstraintRuleService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.productService.getProductsByCode([route.params.productCode])
            .map(res => res[0])
            .filter(product => product != null)
            .distinctUntilKeyChanged('Id')
            .flatMap(product =>
                this.constraintRuleService.getConstraintRules(product)
                    .map(rules => {
                        const activate =
                            ((_.get(product, 'Apttus_Config2__HasAttributes__c') && _.get(product, 'Apttus_Config2__AttributeGroups__r', []).totalSize > 0)
                                || (_.get(product, 'Apttus_Config2__HasOptions__c') && _.get(product, 'Apttus_Config2__OptionGroups__r', []).totalSize > 0))
                            && rules.filter(rule => rule.Apttus_Config2__ConstraintRuleActions__r.records.filter(action => action.Apttus_Config2__ActionType__c === 'Replacement').length > 0).length === 0;
                        if(!activate)
                            this.router.navigate(['/product', product.ProductCode]);
                        return activate;
                    })
            );
    }

}