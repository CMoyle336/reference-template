import { QuoteListComponent } from './quote-list.component';
import * as _ from 'lodash';

export class QuoteActions{
    constructor(private component: QuoteListComponent){}
    public actionConfiguration = {
        'Draft': {
            color: 'secondary',
            actions: [
                {
                    label: 'Download PDF',
                    action: _.bind(this.component.downloadPdf, this.component)
                },
                {
                    label: 'Checkout',
                    action: _.bind(this.component.activateCartForQuote, this.component)
                },
                {
                    label: 'Send',
                    action: this.component.send
                }
            ],
            allowDelete : true
        },
        'Approval Required': {
            color: 'warning',
            actions: [
                {
                    label: 'Download PDF',
                    action: _.bind(this.component.downloadPdf, this.component)
                },
                {
                    label: 'Send',
                    action: this.component.send
                },
                {
                    label: 'Submit for Approval',
                    action: this.component.submitForApproval
                }
            ],
            allowDelete: true
        },
        'In Review': {
            color: 'warning',
            actions: [
                {
                    label: 'Download PDF',
                    action: _.bind(this.component.downloadPdf, this.component)
                },
                {
                    label: 'Send',
                    action: this.component.send
                }
            ],
            allowDelete: false
        },
        'Approved': {
            color: 'success',
            actions: [
                {
                    label: 'Download PDF',
                    action: _.bind(this.component.downloadPdf, this.component)
                },
                {
                    label: 'Send',
                    action: this.component.send
                },
                {
                    label: 'Send for eSignature',
                    action: this.component.send
                }
            ],
            allowDelete: true
        },
        'Accepted': {
            color: 'success',
            actions: [
                {
                    label: 'Download PDF',
                    action: _.bind(this.component.downloadPdf, this.component)
                },
                {
                    label: 'Create Order',
                    action: this.component.createOrder
                },
                {
                    label: 'Send',
                    action: this.component.send
                }
            ],
            allowDelete: true
        },
        'Presented' : {
            color : 'success',
            actions : [
                {
                    label: 'Download PDF',
                    action: this.component.downloadPdf
                },
                {
                    label: 'Create Order',
                    action: this.component.createOrder
                },
                {
                    label: 'Send',
                    action: this.component.send
                }
            ],
            allowDelete: true
        }
    };
}