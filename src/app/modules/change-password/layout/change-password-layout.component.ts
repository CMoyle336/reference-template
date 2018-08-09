import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '@apttus/ecommerce';
import { Router } from '@angular/router';

const sv = (<any>window).sv;

@Component({
  selector: 'app-change-password-layout',
  templateUrl: './change-password-layout.component.html',
  styleUrls: ['./change-password-layout.component.scss']
})
export class ChangePasswordLayoutComponent implements OnInit {

  message: string;
  passwordForm: PasswordForm = {} as PasswordForm;
  loading: boolean = false;

  constructor(private userService: UserService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {

  }

  setPassword(){
    if(this.passwordForm.passwordA !== this.passwordForm.passwordB)
      this.message = 'Your passwords do not match';
    else{
      this.loading = true;
      this.userService.setPassword(this.passwordForm.passwordA).subscribe(
        res => this.ngZone.run(() => {
          this.loading = false;
          if(sv && sv.params)
            sv.params = null;
            this.router.navigate(['']);
        }),
        err => this.ngZone.run(() => {
          if(err.indexOf('invalid repeated password') >= 0)
            this.message = 'Cannot reuse this old password.';
          else
            this.message = 'An error ocurred. Please contact your administrator.';
          this.loading = false;
        })
      );
    }
  }
}

export interface PasswordForm{
  passwordA: string;
  passwordB: string;
}
