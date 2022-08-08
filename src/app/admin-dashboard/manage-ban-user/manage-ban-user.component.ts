import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ModalUnbanUserComponent } from 'src/app/shared/components/modal-unban-user/modal-unban-user.component';

@Component({
  selector: 'app-manage-ban-user',
  templateUrl: './manage-ban-user.component.html',
  styleUrls: ['./manage-ban-user.component.scss']
})
export class ManageBanUserComponent implements OnInit {
  listUser!: User[];
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  searchValue: string = "";
  statusSelected: number = 1;
  isLoading: boolean = false;
  selectedUser!: User;
  modalRef!: NgbModalRef;

  //form
  form: FormGroup;
  isDisabled: boolean = true;
  
  constructor(private adminService: AdminManageService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fullName: [{value: '', disabled: this.isDisabled}, Validators.required],
      bio: [{value: '', disabled: this.isDisabled}, Validators.required],
      phone: [{value: '', disabled: this.isDisabled}, [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      dob: [{value:'', disabled: this.isDisabled}, Validators.required],
    });
  }

  get f() { return this.form.controls; }

  public onPageChange(pageNum: number): void {
    this.loadUsers();
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadUsers();
  }

  toggleEdit() {
    const formStatus:boolean = this.form.enabled;
    if (formStatus) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  openDetail(content:any, user:User) {
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.form.disable();
    this.form.setValue({
      fullName: this.selectedUser.name,
      bio: this.selectedUser.bio,
      phone: this.selectedUser.phoneNumber,
      dob: formatDate(new Date(this.selectedUser.birthDate || new Date), 'yyyy-MM-dd', 'en'),
    });
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setUserStatus(user: User) {
    this.modalRef = this.modalService.open(ModalUnbanUserComponent, {ariaLabelledBy: 'modal-basic-title'});
    this.modalRef.componentInstance.user = user;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  submitFunc() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getBannedUsers(this.statusSelected, this.currentPage).subscribe({
      next: (res: any) => {
        this.collectionSize = res.totalItem;
        let users: User[] = res.items;
        this.listUser = users;
        console.log(this.listUser);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }

}
