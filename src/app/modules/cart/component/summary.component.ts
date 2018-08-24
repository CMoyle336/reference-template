import { Component, OnChanges, Input, TemplateRef, ViewChild  } from '@angular/core';
import { Cart, QuoteService, TemplateService, CartItem, Quote } from '@apttus/ecommerce';
import * as _ from 'lodash';
import { ForceService } from 'ng-salesforce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'cart-summary',
  templateUrl: `./summary.component.html`,
  styles: [`
    .small{
      font-size: smaller;
    }
    li.list-group-item .details small:not(:last-child){
      border-right: 1px solid gray;
      padding-right: 6px;
      margin-right: 6px;
    }
    .confirmation .oi{
        padding: 26px;
        font-size: 75px;
    }
  `]
})
export class SummaryComponent implements OnChanges {
  @Input() cart: Cart;
  @ViewChild('confirmationTemplate') confirmationTemplate: TemplateRef<any>;

  state: SummaryState;
  modalRef: BsModalRef;
  lineItem: CartItem;
  confirmationModal: BsModalRef;
  generatedQuote: Quote;

  get itemCount(): number{
    let count = 0;
    if(_.get(this.cart, 'Apttus_Config2__LineItems__r.records'))
      this.cart.Apttus_Config2__LineItems__r.records.filter(p => p.Apttus_Config2__LineType__c === 'Product/Service').forEach(r => count += Number(r.Apttus_Config2__Quantity__c));
    return count;
  }

  constructor(private quoteService: QuoteService, private templateService: TemplateService, private forceService: ForceService, private modalService: BsModalService) {
    this.state = {
      configurationMessage: null,
      downloadLoading: false,
      requestQuoteMessage: null,
      requestQuoteLoading: false
    };
  }

  ngOnChanges() {}

  createQuote() {
    this.state.requestQuoteLoading = true;
    this.quoteService.convertCartToQuote().subscribe(
      res => {
        this.generatedQuote = res;
        this.state.requestQuoteLoading = false;
        this.confirmationModal = this.modalService.show(this.confirmationTemplate);
      },
      err => {
        this.state.requestQuoteMessage = 'An error occurred generating your quote. Please contact an administrator';
        this.state.requestQuoteLoading = false;
      }
    );
  }

  generatePdf(){
    this.state.downloadLoading = true;
    this.state.configurationMessage = 'Generating your PDF. Please be patient, this may take up to a minute...';
    this.templateService.getActiveTemplates('Proposal').take(1).map(r => r[0]).subscribe(template => {

      const onResponse = (res) => {
        this.state.downloadLoading = false;
        this.state.configurationMessage = null;
        window.open(this.forceService.connection.instanceUrl + '/servlet/servlet.FileDownload?file=' + res.Id, '_blank');
      };

      const onError = (err, quote) => {
        this.quoteService.get([quote.Id]).map(res => res[0]).subscribe(r => {
          this.state.downloadLoading = false;
          const attachment = _.get(r, 'Attachments.records[0]', {});
          if(attachment && attachment.Id){
            const difference = new Date().getTime() - new Date(attachment.CreatedDate).getTime();
            if (difference <= 600000) {
              this.state.configurationMessage = null;
              window.open(this.forceService.connection.instanceUrl + '/servlet/servlet.FileDownload?file=' + attachment.Id, '_blank');
            } else
              this.state.configurationMessage = 'An error occurred generating your document. Please contact an administrator.';
          }
        });
      };

      if(!this.cart.Apttus_QPConfig__Proposald__c)
        this.quoteService.convertCartToQuote()
          .subscribe(quote =>
            this.quoteService.generateDocument(template, quote, 'PDF', true, 'Read only').subscribe(r => onResponse(r), e => onError(e, quote))
          );
      else{
        this.quoteService.generateDocument(template, this.cart.Apttus_QPConfig__Proposald__r, 'PDF', true, 'Read only', this.cart.Id)
          .subscribe(r => onResponse(r), e => onError(e, this.cart.Apttus_QPConfig__Proposald__r));
      }
    });
  }

  openModal(lineItem: CartItem, template: TemplateRef<any>) {
    this.lineItem = lineItem;
    this.modalRef = this.modalService.show(template);
  }
}

export interface SummaryState{
  configurationMessage: string;
  downloadLoading: boolean;
  requestQuoteMessage: string;
  requestQuoteLoading: boolean;
}
