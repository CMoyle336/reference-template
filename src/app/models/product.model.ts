import { Product, ConstraintRuleCondition } from '@apttus/ecommerce';
import { ChildRecord } from 'ng-salesforce';
import { TRProductAttributeGroupMember } from './product-attribute-group.model';

export class TRProduct extends Product{
    Apttus_Config2__AttributeGroups__r: ChildRecord = new ChildRecord(new TRProductAttributeGroupMember());
    Digital_Product_Family__c: string = null;
}

export class TRConstraintRuleCondition extends ConstraintRuleCondition{
    Apttus_Config2__MatchInRelatedLines__c: boolean = undefined;
}