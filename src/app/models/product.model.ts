import { Product } from '@apttus/ecommerce';
import { ChildRecord } from 'ng-salesforce';
import { TRProductAttributeGroupMember } from './product-attribute-group.model';

export class TRProduct extends Product{
    Apttus_Config2__AttributeGroups__r: ChildRecord = new ChildRecord(new TRProductAttributeGroupMember());
}