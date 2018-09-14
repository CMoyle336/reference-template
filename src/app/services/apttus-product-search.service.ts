import { Injectable } from '@angular/core';
import { SoapService } from 'ng-salesforce';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn : 'root'
})
export class MyPriceListService{

    constructor(private soapService: SoapService){}

    public getProductsForPriceList(priceListId: string): Observable<any>{
        return this.soapService.doRequest(' Apttus_CPQApi/CPQWebService', 'getProductsForPriceList', {
            priceListId: priceListId
        });
    }
}