import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { ProductService } from '@apttus/ecommerce';
import { TRProduct } from './models/product.model';
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    `,
  styles: []
})
export class AppComponent {
  title = 'app';
  showHeader: boolean = true;

  constructor(private productService: ProductService) {
    this.productService.setType(TRProduct);
    setTheme('bs4'); // or 'bs4'
  }

}

