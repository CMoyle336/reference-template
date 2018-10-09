import { Component, OnInit } from '@angular/core';
import { MiniProfileComponent } from '@apttus/ecommerce';

@Component({
  selector: 'app-my-mini-profile',
  templateUrl: './my-mini-profile.component.html',
  styleUrls: ['./my-mini-profile.component.scss']
})
export class MyMiniProfileComponent extends MiniProfileComponent implements OnInit {


  ngOnInit() {
  }

}
