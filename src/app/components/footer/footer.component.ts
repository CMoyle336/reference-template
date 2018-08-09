import { Component, OnInit } from '@angular/core';
import { Storefront, StorefrontService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  storefront$: Observable<Storefront>;

  constructor(private storefrontService: StorefrontService) { }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
  }

}
