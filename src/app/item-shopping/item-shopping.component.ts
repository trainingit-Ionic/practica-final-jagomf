import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../app.component';

@Component({
  selector: 'app-item-shopping',
  templateUrl: './item-shopping.component.html',
  styleUrls: ['./item-shopping.component.scss'],
})
export class ItemShoppingComponent {

  @Input() item: Item;
  @Output() valChange: EventEmitter<boolean>;
  @Output() deleteItem: EventEmitter<void>;

  constructor() {
    this.valChange = new EventEmitter();
    this.deleteItem = new EventEmitter();
  }

  changeVal({ detail: { checked } }: { detail: { checked: boolean; } }) {
    this.valChange.emit(checked);
  }

  delete() {
    this.deleteItem.emit();
  }

}
