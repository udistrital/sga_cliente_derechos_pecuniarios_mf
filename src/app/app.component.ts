import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { singleSpaPropsSubject } from '../single-spa/single-spa-props';
import { fromEvent } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'sga-derechos-pecuniarios-mf',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  opened: boolean = false;
  userData = { user: null, userService: null };
  environment = environment;
  whatLang$ = fromEvent(window, 'lang');

  constructor(
    private translate: TranslateService) {
    singleSpaPropsSubject.subscribe((props) => {
      this.environment = Object.assign(environment, props.environment);
    });
    window.addEventListener('single-spa:before-routing-event', (event: any) => {
      const detail = event.detail;
    });
  }

  ngOnInit(): void {
    this.validateLang()
  }

  userEvent(event: any) {
    const { user, userService } = event;
    if (
      userService &&
      user &&
      !this.userData.user &&
      !this.userData.userService
    ) {
      this.userData.user = user;
      this.userData.userService = userService;
    }
  }

  optionEvent(event: any) {
    const { Url } = event;
    if (Url) {
    }
  }

  validateLang() {
    let lang = this.getCookie('lang') || 'es';
    this.whatLang$.subscribe((x:any) => {
      lang = x['detail']['answer'];
      this.translate.setDefaultLang(lang)
    });
    this.translate.setDefaultLang(this.getCookie('lang') || 'es');
  }

  getCookie(name: string): string | undefined {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
  
    if (parts.length == 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined
  }
}
