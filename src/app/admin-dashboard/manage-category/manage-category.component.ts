import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  public listCategory: Category[] = [];
  categoryForm: FormGroup;
  listStatus: string[] = ["Enable", "Disable"];
  selectedStatus: string = this.listStatus[0];
  selectedCategory?: Category;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.categoryForm = this.formBuilder.group(
      {
        categoryID: ["", Validators.required],
        categoryName: ["", Validators.required],
      }
    );
  }

  ngOnInit(): void {
    for (let i = 1; i <= 10; i++) {
      let category1 = new Category(i, "Category " + i, new Date(), Math.random() < 0.5);
      this.listCategory.push(category1);
    }
  }

  triggerModal(content: any) {
    this.categoryForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal', backdrop: 'static'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCofirmModal(content: any, category: Category) {
    this.selectedCategory = category;
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  

  changeSelectStatus(selectedStatus: string) { 
    this.selectedStatus = selectedStatus;
  }

  updateCategory(content: any, category: Category) {
    this.selectedCategory = category;
    this.categoryForm.setValue({
      categoryID: this.selectedCategory.$id,
      categoryName: this.selectedCategory.$name
    });
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    modalRef.result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
