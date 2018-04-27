import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tb-card',
  templateUrl: './tb-card.component.html',
  styles: [
    `.headerdiv {
    padding-left:10px;
  }
  .headerspan {
    font-size:30px;
    font-weight:bold;
    padding-top:5px;
  }`
  ]
})
export class TbCardComponent implements OnInit {
  @Output() addClick = new EventEmitter();
  constructor() {}

  add(event) {
    this.addClick.emit(event);
  }

  ngOnInit() {}
}
