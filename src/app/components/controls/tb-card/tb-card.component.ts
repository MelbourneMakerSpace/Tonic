import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tb-card',
  templateUrl: './tb-card.component.html',
  styles: [
    `
      .headerspan {
        font-size: 24px;
        color: white;
        position: relative;
        padding: 0.4em 1em;
      }
      .cardcontent {
        padding: 1em;
      }
      .card {
        margin-top: 1em;
        margin-bottom: 1em;
      }
      .cardButtonContainer {
        position: relative;
        min-width: 150px;
        display: flex;
        justify-content: flex-end;
      }

      .cardButtons {
        position: absolute;
        top: 10%;
      }

      .subHeaderText {
        padding: 0.5em;
      }
    `,
  ],
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
