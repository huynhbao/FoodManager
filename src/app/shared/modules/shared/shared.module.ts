import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TimePipe } from '../../pipes/time.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SpinnerComponent,
    TimePipe
  ],
  exports: [
    SpinnerComponent,
    TimePipe
  ]
})
export class SharedModule { }
