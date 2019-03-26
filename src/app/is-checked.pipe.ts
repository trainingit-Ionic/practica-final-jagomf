import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './app.component';

@Pipe({ name: 'isChecked' })
export class IsCheckedPipe implements PipeTransform {

  transform(items: Item[], checked: boolean): Item[] {
    if (!items.length || typeof checked === 'undefined') {
      return items;
    }
    return items.filter(item => item.val === checked);
  }

}
