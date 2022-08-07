import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export class ModalInputComponent implements OnInit {

  @Input() id: any;
  @Input() status: any;
  @Input() submitFunc!: Function;
  reasonModel: string = "";
  constructor(public activeModal: NgbActiveModal) { }

  onSubmit() {
    this.submitFunc(this.id, this.reasonModel, this.status);
  }

  ngOnInit(): void {
  }

}
