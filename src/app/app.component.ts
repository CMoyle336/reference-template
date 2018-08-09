import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    `,
  styles: []
})
export class AppComponent {
  title = 'app';
  showHeader: boolean = true;

  constructor(private googleAnalytics: Angulartics2GoogleAnalytics) {
    setTheme('bs4'); // or 'bs4'
  }

}

