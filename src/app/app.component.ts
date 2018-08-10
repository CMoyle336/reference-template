import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

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

  constructor() {
    setTheme('bs4'); // or 'bs4'
  }

}

