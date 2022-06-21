import { Component, OnInit } from '@angular/core';
import { ReportPost } from 'src/app/models/report.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.scss']
})
export class ReportPostComponent implements OnInit {
  reportPosts: ReportPost[] = [];
  currentPage: number = 1;
  itemsPerPage = 5;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  isLoading: boolean = false;
  isLoadingHashtag: boolean = false;
  statusSelected: number = 2;
  searchValue: string = "";
  constructor(private sharedService: SharedService, private managerService: ManagerService) { }

  private loadReports() {
    this.isLoading = true;
    
    this.sharedService.getReportPost(this.searchValue, this.statusSelected, this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let reportPosts: ReportPost[] = res.items;
        this.reportPosts = reportPosts;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setPostByStatus(id: string, status: number) {
    this.managerService.setPostByStatus(id, status).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.loadReports();
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setReportStatus(id: string, status: number) {
    this.sharedService.acceptReportPost(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            this.setPostByStatus(id, 0);
          } else {
            this.loadReports();
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: number) {
    this.statusSelected = status;
    this.loadReports();
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadReports();
  }

  public onPageChange(pageNum: number): void {
    this.loadReports();
  }

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.reportPosts.length; i++) {
      this.reportPosts[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.reportPosts.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.reportPosts.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    })
    this.numSelected = count;
  }

  ngOnInit(): void {
    this.loadReports();
  }

}
