import { Component } from '@angular/core';

@Component({
  selector: 'app-formula-converter',
  templateUrl: './formula-converter.component.html',
  styleUrls: ['./formula-converter.component.scss']
})
export class FormulaConverterComponent {

  tinterQty = 0;
  esdeeTinterQty = 0;
  binderQty = 0;

  convert() {
    this.esdeeTinterQty = parseFloat((this.tinterQty * 0.33).toFixed(2));
    this.binderQty = parseFloat((this.tinterQty - this.esdeeTinterQty).toFixed(2));
  }

}
