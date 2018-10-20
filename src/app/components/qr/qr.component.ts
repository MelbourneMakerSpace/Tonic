import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import * as qr from 'qr-image';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styles: []
})
export class QrComponent implements OnInit {
  @Input()
  CodeText = 'Not Set';
  qrImgBase64: string;

  constructor(public _DomSanitizer: DomSanitizer) {}

  ngOnInit() {
    // const qrpng = <Buffer>qr.imageSync(this.CodeText, { type: 'png' });
    // console.log('qr:', this.bufferToBase64(qrpng));
    // this.qrImgBase64 = 'data:image/png;base64, ' + this.bufferToBase64(qrpng);
  }

  bufferToBase64(buf) {
    const binstr = Array.prototype.map
      .call(buf, function(ch) {
        return String.fromCharCode(ch);
      })
      .join('');
    return btoa(binstr);
  }
}
