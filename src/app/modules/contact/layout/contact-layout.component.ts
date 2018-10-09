import { Component, OnInit } from '@angular/core';
import { ContactService, Contact } from '@apttus/ecommerce';

@Component({
  selector: 'app-contact-layout',
  templateUrl: './contact-layout.component.html',
  styleUrls: ['./contact-layout.component.scss']
})
export class ContactLayoutComponent implements OnInit {

  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

}
