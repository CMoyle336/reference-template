import { SObjectModel, SObject } from 'ng-salesforce';
import { ProductAttributeGroupMember, ProductAttributeGroup } from '@apttus/ecommerce';

@SObjectModel({
    name : 'Apttus_Config2__ProductAttributeGroup__c'
})
export class TRProductAttributeGroup extends SObject{
    Name: string = null;
    Apttus_Config2__AttributeValueMatrixId__c: string = null;
    Apttus_Config2__BusinessObject__c: string = null;
    Apttus_Config2__Description__c: string = null;
    Apttus_Config2__TwoColumnAttributeDisplay__c: string = null;
}

export class TRProductAttributeGroupMember extends ProductAttributeGroupMember{
    Apttus_Config2__AttributeGroupId__r: any = new TRProductAttributeGroup();
}