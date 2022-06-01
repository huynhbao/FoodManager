import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  tabbar: boolean = true;

  constructor(public router: Router, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    let id = this.route.snapshot.params['/post/'];
    console.log(this.route.snapshot);
  }

}
