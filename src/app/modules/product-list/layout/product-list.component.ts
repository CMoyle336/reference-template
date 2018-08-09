import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, Category, SearchResults, SearchService, PriceTier, ProductService } from '@apttus/ecommerce';
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { DOCUMENT} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FieldFilter } from '../component/field-filter.component';
import { Angulartics2GoogleAnalyticsEnhancedEcommerce } from 'angulartics2/ga-enhanced-ecom';
declare var ga: Function;

import * as _ from 'lodash';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public category: Category;
  public subCategories: Array<Category>;
  public searchResults$: Observable<SearchResults>;

  page = 1;
  pageSize = 15;
  view='grid';
  priceTier: PriceTier = null;
  categoryFilter: Array<Category> = [];
  customFilters: Array<FieldFilter> = null;
  sortField: string = null;
  isSearch: boolean = false;
  query: string;

  constructor(private activatedRoute: ActivatedRoute,
              private searchService: SearchService,
              private categoryService: CategoryService,
              private pageScrollService: PageScrollService,
              private at: Angulartics2GoogleAnalyticsEnhancedEcommerce,
              @Inject(DOCUMENT) private document: any) {
    // this.productService.setType(IRProduct);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.categoryFilter = [];
      this.customFilters = new Array();
      this.priceTier = null;
      this.sortField = null;

      if(params['categoryName']){
        this.categoryService.where(`Name = '` + params['categoryName'] + `'`)
          .map(categoryList => categoryList[0])
          .subscribe(category => {
            this.isSearch = false;
            this.category = category;
            this.getResults();
            this.categoryService.getSubcategories(this.category.Id)
              .subscribe(subcategories => this.subCategories = subcategories);
          });
      }else if(params['query']){
        this.query = params['query'];
        this.isSearch = true;
        this.getResults();
      }
    });
  }

  getResults(){
      this.scrollTop();
      if(!this.isSearch){
        this.searchResults$ = this.searchService.searchProductsByCategory(this.category.Id, this.pageSize, (this.page - 1) * this.pageSize, this.sortField, 'ASC', this.categoryFilter, this.priceTier, this.customFilters.map(f => `Apttus_Config2__ProductId__r.` + f.field + ` = '` + f.value + `'`));
      }else
        this.searchResults$ = this.searchService.getSearchResults(this.query, this.pageSize, (this.page - 1) * this.pageSize, this.sortField, 'ASC',
          this.categoryFilter, this.priceTier, this.customFilters.map(f => `Apttus_Config2__ProductId__r.` + f.field + ` = '` + f.value + `'`));
      
      this.analytics();
  }

  scrollTop(){
    setTimeout(() => {
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({document: this.document, scrollTarget: '#top', pageScrollDuration : 200});
      this.pageScrollService.start(pageScrollInstance);
    });
  }

  onPage(evt){
    this.page = evt.page;
    this.getResults();
  }

  onPriceTierChange(evt){
    this.page = 1;
    this.priceTier = evt;
    this.getResults();
  }

  onSubcategoryFilter(evt){
    this.page = 1;
    this.categoryFilter = evt;
    this.getResults();
  }

  onFieldFilter(evt: FieldFilter){
    const index = _.findIndex(this.customFilters, { field: evt.field });

    if(evt.value === 'null' || evt.value === null)
      this.customFilters = this.customFilters.filter(a => a.field !== evt.field);
    else if(index >= 0){
      this.customFilters[index] = evt;
    }else
      this.customFilters.push(evt);

    this.page = 1;
    this.getResults();
  }

  onSortChange(evt){
    this.page = 1;
    this.sortField = evt;
    this.getResults();
  }

  analytics(){
    this.searchResults$.subscribe(results => {
      results.productList.forEach((product, index) => {
        this.at.ecAddImpression({ id: product.ProductCode, name: product.Name, brand: product.Family, category: this.category.Name, position: index});
      });
      ga('send', 'pageview');
    });
  }
}
