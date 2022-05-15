import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  @Input() fromParent: any;
  @Input() submitFunc!: Function;
  
  constructor(public activeModal: NgbActiveModal) { }

  onSubmit() {
    this.submitFunc(this.fromParent.id);
  }

  ngOnInit(): void {
  }

}
