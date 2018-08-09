import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@apttus/ecommerce';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationsComponent implements OnChanges {
  @Input() productList: Array<Product>;
  @Output() change: EventEmitter<Array<Product>> = new EventEmitter<Array<Product>>();

  selectedProducts: Array<Product> = new Array<Product>();
  hoverProduct: Product = null;
  constructor() { }

  ngOnChanges() {}

  addProduct(product: Product){
    setTimeout(() => {
      if (!this.containsProduct(product))
        this.selectedProducts.push(product);
      this.change.emit(this.selectedProducts.slice(0));
    }, 500);
  }

  removeProduct(product: Product){
    this.selectedProducts = this.selectedProducts.filter(p => p.Id !== product.Id);
    this.change.emit(this.selectedProducts.slice(0));
  }

  containsProduct(product: Product): boolean{
    const existing = this.selectedProducts.filter(p => p.Id === product.Id);
    return (existing && existing.length > 0);
  }
}
