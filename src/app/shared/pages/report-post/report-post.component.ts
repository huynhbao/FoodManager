import { Component, OnInit } from '@angular/core';
import { ReportPost } from 'src/app/models/report.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.scss']
})
export class ReportPostComponent implements OnInit {
  reportPosts: ReportPost[] = [];
  currentPage: number = 1;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  hastagSelected: number = 0;
  isLoading: boolean = false;
  isLoadingHashtag: boolean = false;
  statusSelected: number = 1;
  constructor(private sharedService: SharedService) { }

  private loadReports() {
    this.isLoading = true;
    
    this.sharedService.getReportPost(this.statusSelected, this.currentPage).subscribe({
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

  ngOnInit(): void {
    this.loadReports();
  }

}
