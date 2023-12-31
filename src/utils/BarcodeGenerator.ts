import { Injectable } from '@nestjs/common';
import * as JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import { File } from '@web-std/file';

@Injectable()
export class BarcodeGenerator {
  async generateBarcode(data: string) {
    const canvas = createCanvas(200, 200);
    JsBarcode(canvas, data, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 20,
      textMargin: 10,
    });
    const rawBuffer = canvas.toBuffer('image/png');


    // create File from buffer
    const file = new File([rawBuffer], 'barcode.png', {
      type: 'image/png',
    });

    return file;
  }
}
