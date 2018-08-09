import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFormComponent implements OnInit {

  @Input() card: Card;

  constructor() { }

  ngOnInit() {
  }

}

export interface Card {
  number: string;
  expirationYear: string;
  expirationMonth: string;
  securityCode: string;
}