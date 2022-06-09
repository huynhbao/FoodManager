import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';

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

  constructor(private adminService: AdminManageService) {
    
  }

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

  openDetail(user:User) {
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers(this.searchValue, this.statusSelected, this.currentPage)
      .subscribe({
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
