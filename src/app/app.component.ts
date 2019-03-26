import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

export interface Item { text: string; val: boolean; }

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  list: Item[] = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  get hasMarked() {
    return this.list.some(item => item.val);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  changeVal(item: Item, { detail: { checked } }: { detail: { checked: boolean; } }) {
    const prevList = [...this.list];
    prevList.find(it => it.text === item.text).val = checked;
    this.list = prevList;
  }
}
