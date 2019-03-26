import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

export interface Item { text: string; val: boolean; }

const LIST_KEY = 'jagosshoppinglist';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  list: Item[] = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private alertController: AlertController,
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
      this.platform.pause.subscribe(this.onPause.bind(this));
      this.platform.resume.subscribe(this.onResume.bind(this));
    });
  }

  private onPause() {
    this.storage.ready().then(() => {
      this.storage.set(LIST_KEY, this.list);
    });
  }

  private onResume() {
    this.storage.ready().then(() => {
      this.storage.get(LIST_KEY).then(list => {
        this.list = list || [];
      });
    });
  }

  changeVal(item: Item, { detail: { checked } }: { detail: { checked: boolean; } }) {
    const prevList = [...this.list];
    prevList.find(it => it.text === item.text).val = checked;
    this.list = prevList;
  }

  async reqAddItem() {
    const alert = await this.alertController.create({
      header: 'Añadir elemento',
      inputs: [{
        name: 'text',
        type: 'text',
        placeholder: 'Elemento'
      }],
      buttons: [
        { text: 'Cancelar' },
        { text: 'Añadir', handler: this.doAddItem.bind(this) }
      ]
    });
    await alert.present();
  }

  private doAddItem({ text }: { text: string; }) {
    const newList = [...this.list];
    newList.push({ text, val: false });
    this.list = newList;
  }

  async reqReset() {
    const alert = await this.alertController.create({
      header: 'Reiniciar lista',
      message: '¿Borrar los contenidos de la lista y empezar una nueva?',
      buttons: [
        { text: 'Sí', handler: this.doReset.bind(this) },
        { text: 'Cancelar' }
      ]
    });
    await alert.present();
  }

  private doReset() {
    this.list = [];
  }
}
