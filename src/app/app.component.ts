import { Component } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
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
    private toastController: ToastController,
    private storage: Storage,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  get hasUnmarked() {
    return this.list.some(item => !item.val);
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

  changeVal(item: Item, checked: boolean) {
    const prevList = [...this.list];
    prevList.find(it => it.text === item.text).val = checked;
    this.list = prevList;
  }

  deleteItem(item: Item) {
    const prevList = [...this.list];
    const indexToRemove = prevList.findIndex(it => it.text === item.text);
    prevList.splice(indexToRemove, 1);
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

  private async doAddItem({ text }: { text: string; }) {
    if (this.list.find(it => it.text.trim().toLowerCase() === text.trim().toLowerCase())) {
      const toast = await this.toastController.create({
        message: 'Ya está en la lista',
        duration: 3000
      });
      toast.present();
    } else {
      const newList = [...this.list];
      newList.push({ text: text.trim(), val: false });
      this.list = newList;
    }
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
