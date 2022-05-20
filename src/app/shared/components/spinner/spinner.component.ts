import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  @Input() enabled = true;
  @Input() size: number | string = 40;
  @Input() padding: number | string = 6;
  @Input() borderSize: number | string = 5;
  @Input() styles = {};

  @Input() spinnerSize: number | string = 0;

  constructor() {
  }

  ngOnInit(): void {
    if (this.spinnerSize === 1) {
      this.size = 25;
      this.padding = 5;
      this.borderSize = 4;
    }
  }

  get spinnerStyle() {
      return {
          overflow: 'visible',
          width: normalizeSize(this.size),
          height: normalizeSize(this.size),
          "border-width": normalizeSize(this.borderSize),
          ...(typeof this.styles === 'string' ? JSON.parse(this.styles) : this.styles),
      };
  }

  get bgStyle() {
    return {
        padding: normalizeSize(this.padding),
        ...(typeof this.styles === 'string' ? JSON.parse(this.styles) : this.styles),
    };
}
}

export const normalizeSize = (size: number | string) =>
    (parseFloat(size.toString()).toString() === size.toString()
        ? `${size}px`
        : size.toString());
