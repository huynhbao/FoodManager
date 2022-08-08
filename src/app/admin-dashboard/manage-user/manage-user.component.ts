import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ModalBanUserComponent } from 'src/app/shared/components/modal-ban-user/modal-ban-user.component';
import { ModalCreateManagerComponent } from '../modal-create-manager/modal-create-manager.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit {
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

  selectedRole:number = 0;
  rolesOption = [
    {
      role: 0,
      display: "Tất cả"
    },
    {
      role: 1,
      display: "Quản lý"
    },
    {
      role: 2,
      display: "Người dùng"
    },
    {
      role: 3,
      display: "Người dùng Google"
    },
  ]

  
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

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.listUser.length; i++) {
      this.listUser[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.listUser.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.listUser.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    })
    this.numSelected = count;
  }

  public onPageChange(pageNum: number): void {
    this.loadUsers();
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadUsers();
  }

  createManager() {
    this.modalRef = this.modalService.open(ModalCreateManagerComponent, {ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: 'static',});
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
    this.modalRef = this.modalService.open(ModalBanUserComponent, {ariaLabelledBy: 'modal-basic-title'});
    this.modalRef.componentInstance.user = user;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  submitFunc() {
    this.loadUsers();
  }

  changeRole(index: number) {
    this.selectedRole = index;
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    const role = this.rolesOption[this.selectedRole].role;
    this.adminService.getUsers(this.searchValue, this.statusSelected, this.currentPage, role).subscribe({
      next: (res: any) => {
        this.collectionSize = res.totalItem;
        let users: User[] = res.items;
        this.listUser = users;
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
