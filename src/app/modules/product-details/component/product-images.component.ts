import {
  Component,
  NgZone,
  Input,
  OnChanges
} from '@angular/core';
import { Product, ProductService } from '@apttus/ecommerce';
import { ImagePipe } from 'ng-salesforce';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

import * as _ from 'lodash';

declare var $;

@Component({
  selector: 'product-images',
  template: `
    <ngx-gallery [options]="galleryOptions" [images]="galleryImages" *ngIf="!showBlank && galleryImages"></ngx-gallery>
    <img [lazyLoad]="null | image" *ngIf="showBlank" class="w-100 img-fluid"/>
  `,
  styles: [

  ]
})
export class ProductImagesComponent implements OnChanges {
  @Input() product: Product;
  @Input() thumbnails: boolean = true;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showBlank = false;

  constructor(private ngZone: NgZone, private productService: ProductService) { }


  ngOnChanges() {
    if(this.product && this.product.Attachments){
      this.galleryOptions = [
        {
          width: '100%',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          imageSize: 'contain',
          arrowPrevIcon: 'fa fa-arrow-circle-left text-dark',
          arrowNextIcon: 'fa fa-arrow-circle-right text-dark',
          thumbnailsArrows: false,
          imageInfinityMove: true,
          closeIcon: 'fa fa-times-circle-o text-dark',
          thumbnails: this.thumbnails &&  _.get(this.product, 'Attachments.records.length') > 1,
          previewCloseOnClick: true,
          previewCloseOnEsc: true,
        },
        // max-width 400
        {
          breakpoint: 767,
          preview: false,
          width: '100%',
          imagePercent: 80,
          thumbnails: this.thumbnails && _.get(this.product, 'Attachments.records.length') > 1,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
        }
      ];
      this.galleryImages = [];
      if (_.get(this.product, 'Attachments.records')) {
        this.product.Attachments.records.forEach(attachment => {
          this.galleryImages.push({
            small: new ImagePipe(this.productService.config).transform(attachment.Id),
            medium: new ImagePipe(this.productService.config).transform(attachment.Id),
            big: new ImagePipe(this.productService.config).transform(attachment.Id)
          });
        });
      }
      if (!this.galleryImages || this.galleryImages.length === 0)
        this.showBlank = true;
    }
    

  }



}
