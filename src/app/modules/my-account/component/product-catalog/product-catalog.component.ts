import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { ProductService, UserService, Product, PriceListItemService, PriceListItem, PriceListService, CartService } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  modalRef: BsModalRef;
  productList$: Observable<Array<Product>>;
  product: Product = new Product();
  priceListItem: PriceListItem = new PriceListItem();
  message: string;
  loading: boolean = false;

  constructor(private productService: ProductService,
              private userService: UserService,
              private modalService: BsModalService,
              private priceListItemService: PriceListItemService,
              private priceListService: PriceListService,
              private ngZone: NgZone,
              private cartService: CartService) { }

  ngOnInit() {
    this.productList$ = this.userService.me().flatMap(user => this.productService.where(`CreatedById = {0}`, user.Id));
  }

  newProduct(template: TemplateRef<any>) {
    this.product = new Product();
    this.modalRef = this.modalService.show(template);
  }

  editProduct(product: Product, template: TemplateRef<any>){
    this.product = product;
    this.priceListItem = product.Apttus_Config2__PriceLists__r.records[0];
    this.modalRef = this.modalService.show(template);
  }

  deleteProduct(product){
    product._metadata = { loading: true };
    this.productService.delete([product]).subscribe(
      res => {},
      err => {}
    );
  }

  addProductToCart(product){
     product._metadata = { loading: true };
    this.cartService.addProductToCart(product).subscribe(
      res => this.ngZone.run(() => product._metadata = { loading: false }),
      err => {}
    );
  }

  createProduct(){
    this.loading = true;
    this.product.IsActive = true;

    this.priceListService.getPriceListId().take(1).flatMap(priceListId =>
        this.productService.create([this.product]).flatMap(productIdList => {
          this.priceListItem.Apttus_Config2__Active__c = true;
          this.priceListItem.Apttus_Config2__PriceListId__c = priceListId;
          this.priceListItem.Apttus_Config2__ProductId__c = productIdList[0];
          return this.priceListItemService.create([this.priceListItem]);
        })
    )
    .take(1)
    .subscribe(
      res => {
        this.loading = false;
        this.modalRef.hide();
      },
      err => {
        this.loading = false;
        this.message = 'Could not create product. Please contact your administrator';
      }
    );
  }

}
