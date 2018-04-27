import { Component, OnInit, Output, Input } from '@angular/core';
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
    padding-top:5px;
    color:white;
  }`
  ]
})
export class TbCardComponent implements OnInit {
  @Output() addClick = new EventEmitter();
  @Input() LowElevation = false;
  constructor() {}

  add(event) {
    this.addClick.emit(event);
  }

  ngOnInit() {}
}
