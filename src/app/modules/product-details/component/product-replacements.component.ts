import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Product } from '@apttus/ecommerce';

@Component({
  selector: 'apt-product-replacements',
  template: `
    <ul class="list-group list-group-flush">
      <li class="media list-group-item d-flex" *ngFor="let product of productList">
        <img class="mr-3" [src]="product.Apttus_Config2__IconId__c | image" alt="Generic placeholder image"  height="60" width="75">
        <div class="media-body">
          <div class="d-flex justify-content-between">
            <h6 class="font-weight-bold mb-0">{{product.Name}}</h6>
            <price [product]="product"></price>
          </div>
          <small class="d-block">{{product.ProductCode}}</small>
          <button class="btn btn-link btn btn-link p-0 mx-0 mt-2" [routerLink]="['/product', product.ProductCode]">
            <span class="oi oi-chevron-right"></span>Go To Product
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    button .oi{
      font-size: smaller;
      margin-right: 5px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReplacementsComponent implements OnInit {
  @Input() productList: Array<Product>;

  constructor() { }

  ngOnInit() {
  }

}
