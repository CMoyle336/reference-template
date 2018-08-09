import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { AccountLocationService, AccountLocation } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styles: [`
    .info{
      margin: -10px -10px 0 0;
    }
  `]
})
export class AddressBookComponent implements OnInit {
  modalRef: BsModalRef;
  addressList$: Observable<Array<AccountLocation>>;
  addressEdit: AccountLocation;
  loading: boolean = false;
  message: string = null;

  constructor(private accountLocationService: AccountLocationService, private modalService: BsModalService, private ngZone: NgZone) { }

  ngOnInit() {
    this.addressList$ = this.accountLocationService.getAccountLocations();
  }

  newAddress(template: TemplateRef<any>) {
    this.addressEdit = new AccountLocation();
    this.message = null;
    this.modalRef = this.modalService.show(template);
  }

  saveAddress(){
    this.ngZone.run(() => this.loading = true);
    this.accountLocationService.saveLocationToAccount(this.addressEdit)
      .subscribe(
        res => {
          this.loading = false;
          this.modalRef.hide();
        },
        err => {
          console.error(err);
          this.message = 'Failed to save address. Please contact your administrator.';
          this.loading = false;
        }
      );
  }

  setAsDefault(location: AccountLocation){
    this.accountLocationService.setLocationAsDefault(location).subscribe(
      r => console.log(r),
      e => console.error(e)
    );
  }

  deleteAddress(location: AccountLocation){
    this.accountLocationService.delete([location]).subscribe(
      r => console.log(r),
      e => console.error(e)
    );
  }

  edit(location: AccountLocation, template: TemplateRef<any>){
    this.addressEdit = location;
    this.modalRef = this.modalService.show(template);
  }
}
