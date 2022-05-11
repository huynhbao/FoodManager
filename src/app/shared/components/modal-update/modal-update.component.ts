import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit {
  @Input() fromParent: any;
  @Input() submitFunc!: Function;
  categoryForm: FormGroup;
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
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
    let form:any = {};
    form["id"] = this.fromParent[0].id;
    for (const field in this.categoryForm.controls) {
      const control = this.categoryForm.get(field);
      form[field] = control?.value
    }
    this.submitFunc(form);
  }

}
