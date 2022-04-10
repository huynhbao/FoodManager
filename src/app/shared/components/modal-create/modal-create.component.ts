import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss']
})
export class ModalCreateComponent implements OnInit {
  @Input() fromParent: any;
  categoryForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    this.categoryForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    //this.categoryForm = this.formBuilder.group({});
    /* this.categoryForm = this.formBuilder.group(
      {
        categoryID: ["", Validators.required],
        categoryName: ["", Validators.required],
      }
    ); */
    for (let i = 0; i < this.fromParent.length; i++) {
      let value = this.fromParent[i];
      if (i == 0) {
        
      } else {
        for (let _ in value) {
          this.categoryForm.addControl(value.key, new FormControl(value.validator.defaultValue, value.validator.valid))
        }
      }
    }
  }

  //get f() { return this.categoryForm.controls['id'] as FormControl; }

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
    for (var product of this.fromParent[0]) {
      console.log(product)
  }
    for (const field in this.categoryForm.controls) {
      
    }
  }

  log(val: any) { console.log(val); }


}
