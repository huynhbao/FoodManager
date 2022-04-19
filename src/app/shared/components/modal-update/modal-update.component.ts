import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit {
  @Input() fromParent: any;
  categoryForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    this.categoryForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    for (let i = 0; i < this.fromParent.length; i++) {
      let value = this.fromParent[i];
      if (i == 0) {

      } else {
        for (let _ in value) {
          this.categoryForm.addControl(value.key, new FormControl({value: value.validator.defaultValue, disabled: value.validator.disabled}, value.validator.valid))
        }
      }
    }
  }

  triggerModal(content: any) {
    this.categoryForm.reset();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal', backdrop: 'static' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    /* if (this.categoryForm.invalid) {
      return;
    } */
    /* for (var product of this.fromParent[0]) {
      console.log(product)
    } */
    var a:any = {}
    for (const field in this.categoryForm.controls) {
      const control = this.categoryForm.get(field);
      a[field] = control?.value;
    }
    console.log(a);
  }

  log(val: any) { console.log(val); }

}
