import { Component, OnInit } from '@angular/core';
import { UserService, AccountService, User, Account } from '@apttus/ecommerce';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user$: Observable<User>;
  account$: Observable<Account>;

  constructor(private userService: UserService, private accountService: AccountService) { }

  ngOnInit() {
    this.user$ = this.userService.me();
    this.account$ = this.accountService.getMyAccount();
  }

}
