import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-my-account-layout',
  templateUrl: './my-account-layout.component.html',
  styleUrls: ['./my-account-layout.component.scss']
})
export class MyAccountLayoutComponent implements OnInit {

  me$: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.me$ = this.userService.me();
  }

}
